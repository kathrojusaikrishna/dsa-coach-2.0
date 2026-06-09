import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaCode } from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../services/api";

export default function Recommendations() {
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const res = await api.get("/recommendations");

        setRecommendationsData(res.data.recommendations);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // handles
  const handleSolve = async (problemId) => {
    try {
      await api.post(`/recommendations/${problemId}/solve`);

      setRecommendationsData((prev) => prev.filter((p) => p._id !== problemId));

      toast.success("Problem solved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as solved");
    }
  };

  const handleSkip = async (problemId) => {
    try {
      await api.post(`/recommendations/${problemId}/skip`);

      setRecommendationsData((prev) => prev.filter((p) => p._id !== problemId));

      toast.success("Problem skipped successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to skip problem");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Recommended For You</h1>

        <div className="recommendation-summary">
          <span>
            {loading
              ? "Loading recommendations..."
              : `${recommendationsData.length} Personalized Problems`}
          </span>
          <br />
          <span>Based on weak topics</span>
        </div>

        <div className="panel">
          <h3>Recommended Problems</h3>

          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 0",
                gap: "1rem",
              }}
            >
              <div className="spinner"></div>
              <p>Fetching recommendations...</p>
            </div>
          ) : (
            <>
              {recommendationsData.length === 0 && (
                <div className="empty-state">
                  <h2>Great Work!</h2>
                  <p>
                    No recommendations remaining. Come back after syncing your
                    stats.
                  </p>
                </div>
              )}

              {recommendationsData.map((problem) => (
                <div key={problem._id} className="problem-item">
                  <div className="problem-info">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="problem-link"
                    >
                      {problem.title}
                    </a>

                    <p>{problem.topic.join(" • ")}</p>

                    <p className="recommendation-reason">{problem.reason}</p>
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
                    >
                      <FaCode />
                    </a>

                    <button
                      className="solve-btn"
                      onClick={() => handleSolve(problem._id)}
                    >
                      Solved
                    </button>

                    <button
                      className="skip-btn"
                      onClick={() => handleSkip(problem._id)}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
