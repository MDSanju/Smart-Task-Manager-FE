/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../../lib/api";
import styles from "../../../styles/tasks.module.css";

export default function ProjectDetails() {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // filters
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState("");

  const loadProject = async () => {
    if (!projectId) return;

    try {
      const res = await api.get(`/projects/${projectId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      setProject(res.data);

      const teamId = res.data.team?._id;
      if (teamId) {
        const teamRes = await api.get(`/teams/${teamId}`, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setMembers(teamRes.data.members || []);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.msg || err.message || "Failed to load project"
      );
    }
  };

  const loadTasks = async () => {
    if (!projectId) return;

    let url = `/tasks?projectId=${projectId}`;
    if (memberId) url += `&memberId=${memberId}`;
    if (status) url += `&status=${status}`;

    const res = await api.get(url);
    setTasks(res.data);
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [projectId, memberId, status]);

  const deleteTask = async (id: string) => {
    if (!confirm("Delete task?")) return;
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>{project.name}</h2>
        <Link
          href={`/projects/${projectId}/add-task`}
          className={styles.createBtn}
        >
          + Add Task
        </Link>
      </div>

      <p>{project.description}</p>

      {/* Filters */}
      <div className={styles.filterRow}>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Filter by Member</option>
          {members.map((m: any) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setMemberId("");
            setStatus("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Task list */}
      <div className={styles.taskGrid}>
        {tasks.map((t: any) => (
          <div key={t._id} className={styles.taskCard}>
            <h4>{t.title}</h4>
            <p>{t.description}</p>

            <span className={styles.taskStatus}>{t.status}</span>

            <p className={styles.taskPriority}>Priority: {t.priority}</p>
            <p className={styles.taskPriority}>
              Assigned: {t.assignedMemberName || "Unassigned"}
            </p>

            <div className={styles.actions}>
              <Link
                href={`/projects/${projectId}/edit-task/${t._id}`}
                className={styles.editBtn}
              >
                Edit
              </Link>

              <button
                className={styles.deleteBtn}
                onClick={() => deleteTask(t._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
