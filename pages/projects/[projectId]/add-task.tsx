/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/router";
import styles from "../../../styles/tasks.module.css";

export default function AddTask() {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignedMember, setAssignedMember] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  const loadData = async () => {
    if (!projectId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }

      const res = await api.get(`/projects/${projectId}`, {
        headers: { "x-auth-token": token },
      });
      setProject(res.data);

      const teamId = res.data.team?._id;
      if (teamId) {
        const teamRes = await api.get(`/teams/${teamId}`, {
          headers: { "x-auth-token": token },
        });
        setMembers(teamRes.data.members || []);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      console.error("Error loading project or team:", err);
      alert(err?.response?.data?.msg || err.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const submit = async (e: any) => {
    e.preventDefault();

    await api.post("/tasks", {
      title,
      description: desc,
      project: projectId,
      assignedMemberId: assignedMember || null,
      priority,
      status,
    });

    router.push(`/projects/${projectId}`);
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className={styles.formWrapper}>
      <h2>Add Task - {project.name}</h2>

      <form onSubmit={submit}>
        <div className={styles.field}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Assign To</label>
          <select
            value={assignedMember}
            onChange={(e) => setAssignedMember(e.target.value)}
          >
            <option value="">Unassigned</option>
            {members.map((m: any) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Add Task
        </button>
      </form>
    </div>
  );
}
