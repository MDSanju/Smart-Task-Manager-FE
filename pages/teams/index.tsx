/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Link from "next/link";
import styles from "../../styles/team.module.css";

export default function TeamList() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/teams");
      setTeams(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h2 className={styles.heading}>Teams</h2>

      {error && (
        <div className={styles.message + " " + styles.error}>{error}</div>
      )}

      {loading ? (
        <div className={styles.card}>Loading teams...</div>
      ) : (
        <div className={styles.grid}>
          {teams.length === 0 ? (
            <div className={styles.card}>No teams yet. Create one!</div>
          ) : (
            teams.map((t: any) => (
              <Link
                key={t._id}
                href={`/teams/${t._id}`}
                className={styles.card}
              >
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <span>{(t.members || []).length} Members</span>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
