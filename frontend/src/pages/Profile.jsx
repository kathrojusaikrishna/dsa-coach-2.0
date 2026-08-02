import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

gsap.registerPlugin(useGSAP);
export default function Profile() {
  //data
  const [profile, setProfile] = useState(null);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const [stats, setStats] = useState(null);
  const [readiness, setReadiness] = useState(0);
  const [memoryStrength, setMemoryStrength] = useState(0);

  const [modalOpen, setModelOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await api.get("/profile");

        setProfile(profileRes.data);

        if (profileRes.data) {
          setLeetcodeUsername(profileRes.data.leetcodeUsername);

          try {
            const statsRes = await api.get("/leetcode/stats");

            setStats(statsRes.data);

            const readinessRes = await api.get("/recommendations/readiness");

            setReadiness(readinessRes.data.readiness);

            const memRes = await api.get("/recommendations/memory-score");

            setMemoryStrength(memRes.data.memoryStrength);
          } catch (error) {
            console.log("Stats not synced yet");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/profile", {
        leetcodeUsername,
      });

      setProfile(res.data);

      toast.success("Profile connected!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdate(true);
    try {
      const res = await api.put("/profile/update", {
        leetcodeUsername,
      });

      setProfile(res.data);

      console.log(res.data);

      await handleSync();
      setModelOpen(false);

      toast.success("Successfully changed the username");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Cannot update the username right now",
      );
    } finally {
      setUpdate(false);
    }
  };

  const handleSync = async () => {
    try {
      const statsRes = await api.get("/leetcode/stats");

      setStats(statsRes.data);

      const readinessRes = await api.get("/recommendations/readiness");

      setReadiness(readinessRes.data.readiness);

      const memRes = await api.get("/recommendations/memory-score");

      setMemoryStrength(memRes.data.memoryStrength);

      toast.success("Stats synced successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading-box"></div>;
  }

  return (
    <div className="dashboard">
      <Sidebar />

      {modalOpen && (
        <form onSubmit={handleUpdate}>
          <div className="modal-container">
            <div className="heading">
              <h2>Change Username</h2>
              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setModelOpen(!modalOpen)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Leetcode Username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
              />
              <button type="submit" className="edit-btn">
                {update ? <div className="name-load"></div> : "Change"}
              </button>
            </div>
          </div>
        </form>
      )}

      <main
        className={`dashboard-content ${modalOpen ? "background-util" : ""}`}
      >
        <h1>Profile</h1>

        {!profile ? (
          <div className="panel">
            <h2>Connect LeetCode</h2>

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "1rem",
              }}
            >
              Connect your LeetCode account to unlock analytics, recommendations
              and revision tracking.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Enter LeetCode Username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "white",
                }}
              />

              <button type="submit" className="profile-btn">
                Connect
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="panel">
              <div className="connected-profile">
                <div className="profile-info">
                  <h2>{profile.leetcodeUsername}</h2>

                  <p>Connected LeetCode Profile</p>

                  <div className="profile-chip">✓ Active Connection</div>

                  <button className="profile-btn" onClick={handleSync}>
                    Sync LeetCode Stats
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => setModelOpen(!modalOpen)}
                  >
                    {" "}
                    Change Username
                  </button>
                </div>

                <div className="profile-avatar">
                  {profile.leetcodeUsername[0].toUpperCase()}
                </div>
              </div>
            </div>

            {stats && (
              <div className="profile-stats-grid">
                {[
                  ["Total Solved", stats.totalSolved],
                  ["Easy", stats.easySolved],
                  ["Medium", stats.mediumSolved],
                  ["Hard", stats.hardSolved],
                  ["Ranking", stats.ranking.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label} className="profile-stat-card">
                    <p>{label}</p>
                    <h2>{value}</h2>
                  </div>
                ))}
              </div>
            )}

            <div className="panel">
              <h3>Account Progress</h3>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Interview Readiness</span>
                  <span>{readiness}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${readiness}%`,
                    }}
                  />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Memory Strength</span>
                  <span>{memoryStrength}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${memoryStrength}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>Connected Services</h3>

              <div className="service-item">
                <span>LeetCode</span>
                <span className="service-status service-active">Connected</span>
              </div>

              <div className="service-item">
                <span>Codeforces</span>
                <span className="service-status service-coming">
                  Coming Soon
                </span>
              </div>

              <div className="service-item">
                <span>GeeksForGeeks</span>
                <span className="service-status service-coming">
                  Coming Soon
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
