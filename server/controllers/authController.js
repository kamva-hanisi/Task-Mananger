const crypto = require("crypto");
const db = require("../config/db");
const { hashPassword, verifyPassword } = require("../utils/password");
const { createToken } = require("../utils/token");

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUsers = await db.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existingUsers.rows.length > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = hashPassword(password);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [trimmedName, normalizedEmail, passwordHash],
    );
    const user = result.rows[0];

    return res.status(201).json({
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (err) {
    console.error("Failed to create user:", err);
    return res.status(500).json({ message: "Failed to create account" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await db.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (
      result.rows.length === 0 ||
      !verifyPassword(password, result.rows[0].password_hash)
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    return res.json({
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (err) {
    console.error("Failed to sign in:", err);
    return res.status(500).json({ message: "Failed to sign in" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const users = await db.query("SELECT id, email FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (users.rows.length === 0) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      `INSERT INTO password_reset_tokens (user_id, reset_token, expires_at)
       VALUES ($1, $2, $3)`,
      [users.rows[0].id, resetToken, expiresAt],
    );

    return res.json({
      message: "Password reset code created",
      resetCode: resetToken,
    });
  } catch (err) {
    console.error("Failed to start password reset:", err);
    return res.status(500).json({ message: "Failed to start password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, resetCode, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const trimmedCode = resetCode?.trim();

  if (!normalizedEmail || !trimmedCode || !password) {
    return res
      .status(400)
      .json({ message: "Email, reset code, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const tokens = await db.query(
      `SELECT password_reset_tokens.id, password_reset_tokens.user_id
       FROM password_reset_tokens
       JOIN users ON users.id = password_reset_tokens.user_id
       WHERE users.email = $1
         AND password_reset_tokens.reset_token = $2
         AND password_reset_tokens.used_at IS NULL
         AND password_reset_tokens.expires_at > NOW()
       ORDER BY password_reset_tokens.id DESC
       LIMIT 1`,
      [normalizedEmail, trimmedCode],
    );

    if (tokens.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const passwordHash = hashPassword(password);
    const token = tokens.rows[0];

    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      token.user_id,
    ]);
    await db.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1", [
      token.id,
    ]);

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Failed to reset password:", err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};
