/* eslint-disable @typescript-eslint/no-explicit-any */
/* pages/dashboard/index.tsx */
import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import { api } from "../lib/api";
import Link from "next/link";

type Summary = {
  totalProjects: number;
  totalTasks: number;
};

type MemberSummary = {
  memberId: string;
  name: string;
  role: string;
  capacity: number;
  assignedCount: number;
  overloaded: boolean;
};

type TeamSummary = {
  teamId: string;
  teamName: string;
  projectCount: number;
  unassignedCount: number;
  members: MemberSummary[];
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [teamSummary, setTeamSummary] = useState<TeamSummary | null>(null);
  const [reassigning, setReassigning] = useState(false);
  const [recentReassignments, setRecentReassignments] = useState<any[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // load overall summary + teams on mount
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setMessage({ type: "error", text: "Token missing — please login." });
        setLoading(false);
        return;
      }

      // parallel requests: summary and teams
      const [sumRes, teamsRes] = await Promise.all([
        api.get("/dashboard/summary", { headers: { "x-auth-token": token } }),
        api.get("/teams", { headers: { "x-auth-token": token } }),
      ]);

      setSummary(sumRes.data || null);
      setTeams(teamsRes.data || []);
      // auto-select first team if available
      if (teamsRes.data && teamsRes.data.length > 0) {
        const firstId = teamsRes.data[0]._id;
        setSelectedTeamId(firstId);
        // load team summary after selection
        await loadTeamSummary(firstId);
      }
    } catch (err: any) {
      console.error("loadInitial error:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.msg || err.message || "Failed to load dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamSummary = async (teamId: string) => {
    setMessage(null);
    setTeamSummary(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "Token missing — please login." });
        return;
      }
      const res = await api.get(`/dashboard/team-summary/${teamId}`, {
        headers: { "x-auth-token": token },
      });
      setTeamSummary(res.data);
    } catch (err: any) {
      console.error("loadTeamSummary error:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.msg ||
          err.message ||
          "Failed to load team summary",
      });
    }
  };

  const handleTeamChange = async (e: any) => {
    const id = e.target.value;
    setSelectedTeamId(id);
    if (id) await loadTeamSummary(id);
  };

  const handleReassign = async () => {
    if (!selectedTeamId) {
      setMessage({ type: "error", text: "Please select a team first." });
      return;
    }

    if (!confirm("Are you sure you want to reassign tasks for this team?"))
      return;

    setReassigning(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/dashboard/reassign",
        { teamId: selectedTeamId },
        { headers: { "x-auth-token": token } }
      );
      // server returns list of reassignments done — store recent 5
      const list = res.data || [];
      setRecentReassignments((prev) => {
        const combined = [...list, ...prev];
        return combined.slice(0, 5);
      });
      // reload team summary and overall summary
      await Promise.all([loadTeamSummary(selectedTeamId), reloadSummary()]);
      setMessage({
        type: "success",
        text: `Reassigned ${list.length} tasks (if any).`,
      });
    } catch (err: any) {
      console.error("reassign error:", err);
      setMessage({
        type: "error",
        text: err?.response?.data?.msg || err.message || "Reassign failed",
      });
    } finally {
      setReassigning(false);
    }
  };

  const reloadSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/dashboard/summary", {
        headers: { "x-auth-token": token },
      });
      setSummary(res.data || null);
    } catch (err) {
      console.error("reloadSummary error:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.controls}>
          <Link href="/projects" className={styles.linkBtn}>
            View Projects
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`${styles.message} ${
            message.type === "error" ? styles.error : styles.success
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className={styles.loader}>Loading dashboard...</div>
      ) : (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Projects</div>
              <div className={styles.statNumber}>
                {summary?.totalProjects ?? 0}
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Tasks</div>
              <div className={styles.statNumber}>
                {summary?.totalTasks ?? 0}
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>Selected Team</div>
              <div className={styles.teamSelectRow}>
                <select
                  value={selectedTeamId}
                  onChange={handleTeamChange}
                  className={styles.teamSelect}
                >
                  <option value="">-- Select team --</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.reassignBtn}
                  onClick={handleReassign}
                  disabled={reassigning}
                >
                  {reassigning ? "Reassigning..." : "Reassign Tasks"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.leftCol}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Team Summary</h3>

                {!teamSummary ? (
                  <p className={styles.empty}>
                    Select a team to view its summary.
                  </p>
                ) : (
                  <>
                    <div className={styles.teamMeta}>
                      <div>
                        <strong>{teamSummary.teamName}</strong>
                      </div>
                      <div className={styles.small}>
                        Projects: {teamSummary.projectCount} • Unassigned:{" "}
                        {teamSummary.unassignedCount}
                      </div>
                    </div>

                    <table className={styles.membersTable}>
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Role</th>
                          <th>Tasks</th>
                          <th>Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamSummary.members.map((m) => (
                          <tr
                            key={m.memberId}
                            className={m.overloaded ? styles.overloadedRow : ""}
                          >
                            <td className={styles.memberName}>{m.name}</td>
                            <td className={styles.memberRole}>{m.role}</td>
                            <td className={styles.memberTasks}>
                              {m.assignedCount}
                              {m.overloaded && (
                                <span className={styles.overloadedBadge}>
                                  Overloaded
                                </span>
                              )}
                            </td>
                            <td className={styles.memberCapacity}>
                              {m.capacity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Recent Reassignments</h3>

                {recentReassignments.length === 0 ? (
                  <p className={styles.empty}>No recent reassignments</p>
                ) : (
                  <ul className={styles.recentList}>
                    {recentReassignments
                      .slice(0, 5)
                      .map((r: any, i: number) => (
                        <li key={i} className={styles.recentItem}>
                          <div className={styles.reassignText}>
                            <strong>
                              {r.taskTitle ||
                                r.title ||
                                r.task?.title ||
                                "Task"}
                            </strong>
                            <span className={styles.reassignMeta}>
                              moved to{" "}
                              <strong>
                                {r.newMemberName ||
                                  r.assignedMemberName ||
                                  "Unassigned"}
                              </strong>
                            </span>
                          </div>
                          <div className={styles.reassignTime}>
                            {new Date(
                              r.createdAt || r.movedAt || Date.now()
                            ).toLocaleString()}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
