/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* pages/teams/[teamId]/edit-member/[memberId].tsx */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../../lib/api";
import styles from "../../../../styles/team.module.css";

export default function EditMember() {
  const router = useRouter();
  const { teamId, memberId } = router.query;

  const [member, setMember] = useState<any | null>(null);
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const load = async () => {
    if (!teamId) return;
    try {
      const res = await api.get(`/teams/${teamId}`);
      const m = res.data.members.find((x: any) => x._id === memberId);
      setMember(m || null);
      setCapacity(m?.capacity ?? 0);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Failed to load member" });
    }
  };

  useEffect(() => {
    load();
  }, [teamId, memberId]);

  const update = async (e: any) => {
    e.preventDefault();
    if (capacity < 0 || capacity > 5)
      return setMsg({ type: "error", text: "Capacity must be 0–5" });

    setLoading(true);
    setMsg(null);
    try {
      await api.put(`/teams/${teamId}/members/${memberId}`, { capacity });
      setMsg({ type: "success", text: "Member updated" });
      setTimeout(() => router.push(`/teams/${teamId}`), 600);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!member) return <div className={styles.card}>Loading member...</div>;

  return (
    <section>
      <h2 className={styles.heading}>Edit Member: {member.name}</h2>

      {msg && (
        <div
          className={`${styles.message} ${
            msg.type === "error" ? styles.error : styles.success
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className={styles.formWrapper}>
        <form onSubmit={update}>
          <label>Capacity (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </section>
  );
}
