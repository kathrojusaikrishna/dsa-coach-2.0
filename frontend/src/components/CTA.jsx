import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta">
      <div className="cta-box">
        <h2>Ready to Stop Forgetting DSA?</h2>

        <p>
          Join DSA Coach 2.0 and transform problem solving into long-term
          retention.
        </p>

        <button className="primary-btn" onClick={() => navigate("/register")}>
          Get Started Free
        </button>
      </div>
    </section>
  );
}
