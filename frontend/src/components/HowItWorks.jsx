export default function HowItWorks() {
  const steps = [
    "Connect LeetCode Profile",
    "Analyze Solving Patterns",
    "Get Smart Recommendations",
    "Track Memory Retention",
    "Improve Interview Readiness",
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <h2>How It Works</h2>

      <div className="timeline">
        {steps.map((step, index) => (
          <div key={step} className="timeline-item">
            <div className="step-number">{index + 1}</div>

            <div className="step-content">
              <h3>{step}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
