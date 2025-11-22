/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/router";
import styles from "../../styles/team.module.css";

export default function CreateTeam() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    if (!name.trim())
      return setMsg({ type: "error", text: "Team name is required" });

    setLoading(true);
    try {
      await api.post("/teams", { name: name.trim(), description: desc.trim() });
      setMsg({ type: "success", text: "Team created successfully" });
      setName("");
      setDesc("");
      // small delay then redirect
      setTimeout(() => router.push("/teams"), 700);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Create failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className={styles.heading}>Create Team</h2>

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
          <label>Team Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alpha Team"
            required
          />

          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Frontend squad"
          />

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </section>
  );
}
