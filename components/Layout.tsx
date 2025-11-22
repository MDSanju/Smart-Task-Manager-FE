import Sidebar from "./Sidebar";
import styles from "../styles/layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
