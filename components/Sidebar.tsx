"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import styles from "../styles/sidebar.module.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const path = router.pathname;

  const isActive = (p: string) => path === p;

  return (
    <aside className={styles.sidebar}>
      <div>
        <h2 className={styles.title}>TaskFlow</h2>
        <div className={styles.brandSub}>Smart Task Manager</div>
      </div>

      <nav className={styles.nav}>
        <Link
          href="/dashboard"
          className={`${styles.link} ${
            isActive("/dashboard") ? styles.active : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/teams"
          className={`${styles.link} ${
            isActive("/teams") ? styles.active : ""
          }`}
        >
          Teams
        </Link>

        <Link
          href="/teams/create"
          className={`${styles.link} ${
            isActive("/teams/create") ? styles.active : ""
          }`}
        >
          Create Team
        </Link>

        <Link
          href="/projects"
          className={`${styles.link} ${
            isActive("/projects") ? styles.active : ""
          }`}
        >
          Projects
        </Link>

        <Link
          href="/projects/create"
          className={`${styles.link} ${
            isActive("/projects/create") ? styles.active : ""
          }`}
        >
          Create Projects
        </Link>
      </nav>

      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>

      <div className={styles.sideFooter}>
        © {new Date().getFullYear()} TaskFlow
      </div>
    </aside>
  );
}
