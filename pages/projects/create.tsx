/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/router";
import styles from "../../styles/projects.module.css";

export default function CreateProject() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [teamId, setTeamId] = useState("");

  const router = useRouter();

  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("/projects", {
        name,
        description: desc,
        team: teamId,
      });

      router.push("/projects");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Create Project</h2>

      <form onSubmit={submit}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Select Team</label>
          <select
            className={styles.select}
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">Select Team</option>
            {teams.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.createBtn}>
          Create
        </button>
      </form>
    </div>
  );
}
