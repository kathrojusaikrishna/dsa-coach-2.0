import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import "../styles/dashborad.css";
import api from "../services/api";
import { FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProgressRing from "../components/ProgressRing";
import WeakTopicsChart from "../components/WeakTopicsChart";
import MemoryPieChart from "../components/MemoryPieChart";

export default function Dashboard() {
  const navigate = useNavigate();

  //data
  const [readiness, setReadiness] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [memoryStrength, setMemoryStrength] = useState(0);
  const [revisionCount, setRevisionCount] = useState(0);
  const [weakTopics, setWeakTopics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [memoryData, setMemoryData] = useState([]);

  //loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const readinessRes = await api.get("/recommendations/readiness");
        setReadiness(readinessRes.data.readiness);

        const statsRes = await api.get("/leetcode/stats");
        setTotalSolved(statsRes.data.totalSolved);

        const memRes = await api.get("/recommendations/memory-score");

        setMemoryStrength(memRes.data.memoryStrength);

        setMemoryData([
          {
            name: "Fresh",
            value: memRes.data.fresh,
          },
          {
            name: "Good",
            value: memRes.data.good,
          },
          {
            name: "Weak",
            value: memRes.data.weak,
          },
          {
            name: "Forgotten",
            value: memRes.data.forgotten,
          },
        ]);

        const revRes = await api.get("/recommendations/forgotten");
        setRevisionCount(revRes.data.length);

        const weakRes = await api.get("/recommendations/weak-topics");
        setWeakTopics(weakRes.data.weakTopics);

        const recRes = await api.get("/recommendations");
        setRecommendations(recRes.data.recommendations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "23rem",
          color: "#7c3aed",
          fontSize: "32px",
          fontFamily: "sans-serif",
        }}
      >
        Dashboard Loading...
      </h2>
    );
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <StatCard title="Problems Solved" value={totalSolved} />
          <StatCard title={"Problems Due"} value={revisionCount} />
          <div className="ring-card">
            <ProgressRing value={readiness} title="Interview Readiness" />
          </div>

          <div className="ring-card">
            <ProgressRing value={memoryStrength} title="Memory Strength" />
          </div>
        </div>

        <div className="dashboard-row">
          <WeakTopicsChart data={weakTopics} />
          <MemoryPieChart data={memoryData} />

          <div className="panel" onClick={() => navigate("/revision")}>
            <h3>Revision Due Today</h3>

            <h1>{revisionCount}</h1>

            <p>
              {revisionCount === 0
                ? "No Problems Due.."
                : "Problems waiting for revision"}
            </p>
          </div>
        </div>

        <div className="panel" onClick={() => navigate("/recommendations")}>
          <h3>Recommended Problems</h3>
          {recommendations.length === 0 ? (
            <p>No Recommendations available</p>
          ) : (
            recommendations.map((problem) => (
              <div key={problem._id} className="problem-item">
                <div>
                  <strong>{problem.title}</strong>

                  <p>{problem.topic.join(" • ")}</p>
                </div>

                <div className="problem-actions">
                  <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>

                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="leetcode-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaCode />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
