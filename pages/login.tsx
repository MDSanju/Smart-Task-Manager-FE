import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/AuthForm.module.css";
import Link from "next/link";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("mominul@example.com"); // optional prefill
  const [password, setPassword] = useState("password123");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErr(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    }
  };

  return (
    <div className={styles.authWrap}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2>Sign in</h2>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {err && <div className={styles.error}>{err}</div>}

        <button className={styles.submit} disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className={styles.switch}>
          Dont have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
