import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/AuthForm.module.css";
import Link from "next/link";

export default function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await register(name, email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className={styles.authWrap}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2>Create account</h2>
        <label>
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
            minLength={6}
          />
        </label>

        {err && <div className={styles.error}>{err}</div>}

        <button className={styles.submit} disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>

        <p className={styles.switch}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
