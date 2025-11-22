/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { useRouter } from "next/router";
import styles from "../../../../styles/tasks.module.css";

export default function EditTask() {
  const router = useRouter();
  const { projectId, taskId } = router.query;

  const [task, setTask] = useState<any>(null);
  const [members, setMembers] = useState([]);

  const loadData = async () => {
    if (!projectId || !taskId) return;

    const t = await api.get(`/tasks/${taskId}`);
    setTask(t.data);

    const p = await api.get(`/projects/${projectId}`);
    const tm = await api.get(`/teams/${p.data.team?._id}`);
    setMembers(tm.data.members);
  };

  useEffect(() => {
    loadData();
  }, [projectId, taskId]);

  const update = async (e: any) => {
    e.preventDefault();

    await api.put(`/tasks/${taskId}`, {
      title: task.title,
      description: task.description,
      assignedMemberId: task.assignedMemberId || null,
      priority: task.priority,
      status: task.status,
    });

    router.push(`/projects/${projectId}`);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className={styles.formWrapper}>
      <h2>Edit Task</h2>

      <form onSubmit={update}>
        <label>Title</label>
        <input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />

        <label>Assign To</label>
        <select
          value={task.assignedMemberId || ""}
          onChange={(e) =>
            setTask({ ...task, assignedMemberId: e.target.value })
          }
        >
          <option value="">Unassigned</option>
          {members.map((m: any) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <label>Priority</label>
        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Status</label>
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button type="submit" className={styles.primaryBtn}>
          Update Task
        </button>
      </form>
    </div>
  );
}
