import { useState } from "react";
import api from "../services/api";
import "../styles/ResumeAnalysis.css";
import Sidebar from "../components/Sidebar";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("role", role);

      const response = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429) {
        alert(error.response.data.message);
        return;
      }

      alert(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="resume-page">
        <div className="resume-container">
          <h2>Resume Analyzer</h2>

          <div className="input-group">
            <label>Target Role</label>

            <input
              type="text"
              className="role-input"
              placeholder="e.g. Frontend Developer, SDE-1, AI Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <br />
          <br />

          <input
            className="file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br />
          <br />

          <button
            className="analyze-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {analysis && (
            <div className="analysis-container">
              <h3>Remaining Attempts: {analysis.remainingAttempts}</h3>

              <div className="score-grid">
                <div className="score-card">
                  <h4>Match Score</h4>
                  <h1>{analysis.matchScore}%</h1>
                </div>

                <div className="score-card">
                  <h4>Coding</h4>
                  <h1>{analysis.codingStrength}%</h1>
                </div>

                <div className="score-card">
                  <h4>Projects</h4>
                  <h1>{analysis.projectStrength}%</h1>
                </div>

                <div className="score-card">
                  <h4>Interview</h4>
                  <h1>{analysis.interviewReadiness}%</h1>
                </div>
              </div>

              <hr />

              <div className="section-card strengths">
                <h2>Strengths</h2>
                <ul>
                  {analysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="section-card weaknesses">
                <h2>Weaknesses</h2>
                <ul>
                  {analysis.weaknesses.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="section-card skills">
                <h2>Missing Skills</h2>
                <ul>
                  {analysis.missingSkills.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="section-card improvements">
                <h2>Resume Improvements</h2>
                <ul>
                  {analysis.resumeImprovements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="section-card roadmap">
                <h2>Roadmap</h2>
                <ul>
                  {analysis.roadmap.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default ResumeAnalyzer;
