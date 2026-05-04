const db = require("../config/db");
const { hashPassword, verifyPassword } = require("../utils/password");
const { createToken } = require("../utils/token");
const crypto = require("crypto");

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

exports.signUp = (req, res) => {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [normalizedEmail],
    (findErr, existingUsers) => {
      if (findErr) {
        console.error("Failed to check user:", findErr);
        return res.status(500).json({ message: "Failed to create account" });
      }

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: "Email is already registered" });
      }

      const passwordHash = hashPassword(password);

      db.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [trimmedName, normalizedEmail, passwordHash],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Failed to create user:", insertErr);
            return res.status(500).json({ message: "Failed to create account" });
          }

          const user = {
            id: result.insertId,
            name: trimmedName,
            email: normalizedEmail,
          };

          return res.status(201).json({
            user: publicUser(user),
            token: createToken(user),
          });
        },
      );
    },
  );
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [normalizedEmail],
    (err, users) => {
      if (err) {
        console.error("Failed to sign in:", err);
        return res.status(500).json({ message: "Failed to sign in" });
      }

      if (users.length === 0 || !verifyPassword(password, users[0].password_hash)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = users[0];

      return res.json({
        user: publicUser(user),
        token: createToken(user),
      });
    },
  );
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  db.query(
    "SELECT id, email FROM users WHERE email = ?",
    [normalizedEmail],
    (err, users) => {
      if (err) {
        console.error("Failed to start password reset:", err);
        return res.status(500).json({ message: "Failed to start password reset" });
      }

      if (users.length === 0) {
        return res.status(404).json({ message: "No account found with that email" });
      }

      const resetToken = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      db.query(
        "INSERT INTO password_reset_tokens (user_id, reset_token, expires_at) VALUES (?, ?, ?)",
        [users[0].id, resetToken, expiresAt],
        (insertErr) => {
          if (insertErr) {
            console.error("Failed to save password reset token:", insertErr);
            return res.status(500).json({ message: "Failed to start password reset" });
          }

          return res.json({
            message: "Password reset code created",
            resetCode: resetToken,
          });
        },
      );
    },
  );
};

exports.resetPassword = (req, res) => {
  const { email, resetCode, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const trimmedCode = resetCode?.trim();

  if (!normalizedEmail || !trimmedCode || !password) {
    return res.status(400).json({ message: "Email, reset code, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  db.query(
    `SELECT password_reset_tokens.id, password_reset_tokens.user_id
     FROM password_reset_tokens
     JOIN users ON users.id = password_reset_tokens.user_id
     WHERE users.email = ?
       AND password_reset_tokens.reset_token = ?
       AND password_reset_tokens.used_at IS NULL
       AND password_reset_tokens.expires_at > NOW()
     ORDER BY password_reset_tokens.id DESC
     LIMIT 1`,
    [normalizedEmail, trimmedCode],
    (findErr, tokens) => {
      if (findErr) {
        console.error("Failed to verify password reset token:", findErr);
        return res.status(500).json({ message: "Failed to reset password" });
      }

      if (tokens.length === 0) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }

      const passwordHash = hashPassword(password);
      const token = tokens[0];

      db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [passwordHash, token.user_id],
        (updateErr) => {
          if (updateErr) {
            console.error("Failed to update password:", updateErr);
            return res.status(500).json({ message: "Failed to reset password" });
          }

          db.query(
            "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?",
            [token.id],
            (tokenErr) => {
              if (tokenErr) {
                console.error("Failed to mark reset token as used:", tokenErr);
              }

              return res.json({ message: "Password reset successfully" });
            },
          );
        },
      );
    },
  );
};
