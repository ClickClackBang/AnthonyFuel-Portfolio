import React, { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem("admin_token", token);
        onSuccess(token);
      } else {
        setError("Incorrect password.");
        setShake(true);
        setPassword("");
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className={`admin-login-card ${shake ? "shake" : ""}`}>
        <div className="admin-login-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-subtitle">This area is restricted.</p>

        {error && <p className="admin-login-error">{error}</p>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="admin-login-input"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !password}
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;