/* eslint-disable react-hooks/purity */
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";

const randomTexts = [
  "A smooth cup of tea... (wait you don't like tea)",
  "Keep pushing — small steps every day.",
  "Today is a good day to build something great.",
  "You are logged in. Enjoy the app!",
  "Tip: Use secure passwords and keep your token safe.",
];

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const random = randomTexts[Math.floor(Math.random() * randomTexts.length)];

  if (!token) return null;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>Welcome</h1>
        <button className={styles.logout} onClick={() => logout()}>
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h3>Random note</h3>
          <p>{random}</p>
        </div>
      </main>
    </div>
  );
}
