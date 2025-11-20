import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Auth App</title>
      </Head>
      <main className={styles.container}>
        <h1>Welcome</h1>
        <p>Use the links to register or login</p>
        {/* <div className={styles.links}>
          <Link href="/register">
            <a className={styles.btn}>Register</a>
          </Link>
          <Link href="/login">
            <a className={styles.btnOutline}>Login</a>
          </Link>
        </div> */}
      </main>
    </>
  );
}
