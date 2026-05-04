import { useState } from "react";
import API from "../services/api";

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedResetCode, setGeneratedResetCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";
  const isForgotPassword = mode === "forgot";
  const isResetPassword = mode === "reset";

  const submitAuth = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isForgotPassword) {
        const res = await API.post("/auth/forgot-password", {
          email: email.trim(),
        });

        setGeneratedResetCode(res.data.resetCode);
        setResetCode(res.data.resetCode);
        setMode("reset");
        setMessage("Use this reset code to create a new password.");
        return;
      }

      if (isResetPassword) {
        await API.post("/auth/reset-password", {
          email: email.trim(),
          resetCode: resetCode.trim(),
          password,
        });

        setPassword("");
        setResetCode("");
        setGeneratedResetCode("");
        setMode("signin");
        setMessage("Password reset. Sign in with your new password.");
        return;
      }

      const payload = isSignUp
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };
      const endpoint = isSignUp ? "/auth/signup" : "/auth/signin";
      const res = await API.post(endpoint, payload);

      if (res.data.token !== undefined) {
        localStorage.setItem("task_manager_token", res.data.token);
      }
      if (res.data.user !== undefined) {
        localStorage.setItem(
          "task_manager_user",
          JSON.stringify(res.data.user),
        );
        onAuth(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-heading">
          <h1>Task Manager</h1>
          <p>
            {isSignUp && "Create your account"}
            {mode === "signin" && "Sign in to your tasks"}
            {isForgotPassword && "Recover your account"}
            {isResetPassword && "Create a new password"}
          </p>
        </div>

        <div className="auth-tabs" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={submitAuth}>
          {isSignUp && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {isResetPassword && (
            <label>
              Reset Code
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="6 digit code"
                required
              />
            </label>
          )}

          {!isForgotPassword && (
            <label>
              Password
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength="6"
                required
              />
            </label>
          )}

          {!isForgotPassword && (
            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
          )}

          {generatedResetCode && (
            <div className="reset-code">Reset code: {generatedResetCode}</div>
          )}

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading && "Please wait..."}
            {!loading && isSignUp && "Create Account"}
            {!loading && mode === "signin" && "Sign In"}
            {!loading && isForgotPassword && "Get Reset Code"}
            {!loading && isResetPassword && "Reset Password"}
          </button>

          {mode === "signin" && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setError("");
                setMessage("");
                setMode("forgot");
              }}
            >
              Forgot password?
            </button>
          )}

          {(isForgotPassword || isResetPassword) && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setError("");
                setMessage("");
                setGeneratedResetCode("");
                setMode("signin");
              }}
            >
              Back to Sign In
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

export default AuthPage;
