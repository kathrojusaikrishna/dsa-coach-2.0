import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FaCode } from "react-icons/fa";

export default function Revision() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevisionProblems = async () => {
      try {
        const res = await api.get("/recommendations/forgotten");

        setProblems(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisionProblems();
  }, []);

  if (loading)
    return (
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25rem",
        }}
      >
        Loading...
      </h2>
    );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Revision Queue</h1>

        <div className="panel">
          <h3>Problems Due ({problems.length})</h3>

          {problems.length === 0 ? (
            <p>No revision due </p>
          ) : (
            problems.map((problem) => (
              <div key={problem.title} className="problem-item">
                <div>
                  <strong>{problem.title}</strong>

                  <p>{problem.topic}</p>
                </div>

                <div className="problem-actions">
                  <span
                    className={`difficulty ${problem.retention.toLowerCase()}`}
                  >
                    {problem.retention}
                  </span>
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="leetcode-btn"
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
