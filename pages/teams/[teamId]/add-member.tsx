/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../lib/api";
import styles from "../../../styles/team.module.css";

export default function AddMember() {
  const router = useRouter();
  const { teamId } = router.query;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setMsg(null);

    if (!name.trim())
      return setMsg({ type: "error", text: "Name is required" });
    if (!role.trim())
      return setMsg({ type: "error", text: "Role is required" });
    if (capacity < 0 || capacity > 5)
      return setMsg({ type: "error", text: "Capacity must be 0–5" });

    setLoading(true);
    try {
      await api.post(`/teams/${teamId}/members`, {
        name: name.trim(),
        role: role.trim(),
        capacity,
      });
      setMsg({ type: "success", text: "Member added" });
      setName("");
      setRole("");
      setCapacity(1);
      setTimeout(() => router.push(`/teams/${teamId}`), 600);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Add failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className={styles.heading}>Add Member</h2>

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
        <form onSubmit={submit}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

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
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </section>
  );
}
