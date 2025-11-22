/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* pages/projects/index.tsx */
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import styles from "../../styles/projects.module.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
        <Link href="/projects/create" className={styles.createBtn}>
          + Create Project
        </Link>
      </div>

      <div className={styles.projectList}>
        {projects.map((p: any) => (
          <Link
            key={p._id}
            href={`/projects/${p._id}`}
            className={styles.projectCard}
          >
            <h3>{p.name}</h3>
            <p>{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
