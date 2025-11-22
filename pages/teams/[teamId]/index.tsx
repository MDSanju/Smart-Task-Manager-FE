/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../lib/api";
import Link from "next/link";
import styles from "../../../styles/team.module.css";

export default function TeamDetails() {
  const router = useRouter();
  const { teamId } = router.query;

  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const load = async () => {
    if (!teamId) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.get(`/teams/${teamId}`);
      setTeam(res.data);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Failed to load team" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [teamId]);

  const del = async (memberId: string) => {
    if (!confirm("Delete member?")) return;
    setMsg(null);
    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
      setMsg({ type: "success", text: "Member removed" });
      await load();
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Delete failed" });
    }
  };

  if (!team && loading)
    return <div className={styles.card}>Loading team...</div>;
  if (!team) return <div className={styles.card}>Team not found</div>;

  return (
    <section>
      <h2 className={styles.heading}>{team.name}</h2>
      <p className={styles.card}>{team.description}</p>

      {msg && (
        <div
          className={`${styles.message} ${
            msg.type === "error" ? styles.error : styles.success
          }`}
        >
          {msg.text}
        </div>
      )}

      <Link
        href={`/teams/${teamId}/add-member`}
        className={styles.btnPrimary}
        style={{ display: "inline-block", marginTop: 12 }}
      >
        Add Member
      </Link>

      <h3 style={{ marginTop: 20 }}>Members</h3>

      <div className={styles.members}>
        {team.members && team.members.length === 0 && (
          <div className={styles.card}>No members yet</div>
        )}

        {team.members &&
          team.members.map((m: any) => (
            <div key={m._id} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <h4>{m.name}</h4>
                <p>Role: {m.role}</p>
                <p>Capacity: {m.capacity}</p>
              </div>

              <div className={styles.actionRow}>
                <Link
                  href={`/teams/${teamId}/edit-member/${m._id}`}
                  className={`${styles.btnSmall} ${styles.btnEdit}`}
                >
                  Edit
                </Link>

                <button
                  className={`${styles.btnSmall} ${styles.btnDelete}`}
                  onClick={() => del(m._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
