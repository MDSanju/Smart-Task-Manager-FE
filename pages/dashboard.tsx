/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    capacity: 1,
  });

  // Fetch teams
  const loadTeams = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/teams", {
      headers: { "x-auth-token": token },
    });
    setTeams(res.data);
  };

  const loadTeamMembers = async (teamId: string) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/teams/${teamId}`, {
      headers: { "x-auth-token": token },
    });
    setSelectedTeam(res.data);
    setMembers(res.data.members || []);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Create team
  const createTeam = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/teams", newTeam, {
      headers: { "x-auth-token": token },
    });
    setShowCreate(false);
    setNewTeam({ name: "", description: "" });
    loadTeams();
  };

  // Add member
  const addMember = async () => {
    if (!selectedTeam) return;
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:5000/api/teams/${selectedTeam._id}/members`,
      newMember,
      {
        headers: { "x-auth-token": token },
      }
    );
    setNewMember({ name: "", role: "", capacity: 1 });
    loadTeamMembers(selectedTeam._id);
  };

  // Remove member
  const deleteMember = async (memberId: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/teams/${selectedTeam._id}/members/${memberId}`,
      {
        headers: { "x-auth-token": token },
      }
    );
    loadTeamMembers(selectedTeam._id);
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>Smart Task Manager</h2>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreate(true)}
        >
          + Create Team
        </button>
        <div className={styles.teamList}>
          {teams.map((t: any) => (
            <div
              key={t._id}
              className={styles.teamItem}
              onClick={() => loadTeamMembers(t._id)}
            >
              {t.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {!selectedTeam && (
          <h2 className={styles.placeholder}>Select a team to view details</h2>
        )}

        {selectedTeam && (
          <div>
            <h2 className={styles.teamTitle}>{selectedTeam.name}</h2>
            <p className={styles.teamDesc}>{selectedTeam.description}</p>

            {/* Add Member Form */}
            <div className={styles.memberForm}>
              <input
                placeholder="Member Name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
              <input
                placeholder="Role"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              />
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Capacity"
                value={newMember.capacity}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    capacity: Number(e.target.value),
                  })
                }
              />
              <button className={styles.addBtn} onClick={addMember}>
                Add
              </button>
            </div>

            {/* Member List */}
            <div className={styles.memberList}>
              {members.map((m: any) => (
                <div key={m._id} className={styles.memberCard}>
                  <div>
                    <h4>{m.name}</h4>
                    <p>{m.role}</p>
                    <p>Capacity: {m.capacity}</p>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteMember(m._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Create New Team</h3>
            <input
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newTeam.description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, description: e.target.value })
              }
            />
            <button className={styles.saveBtn} onClick={createTeam}>
              Save
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
