import React from "react";
import { FaBrain, FaChartLine, FaBullseye, FaClock } from "react-icons/fa";
import { useGSAP } from "@gsap/react";

import { useEffect } from "react";

export default function Features() {
  const features = [
    {
      icon: <FaBrain />,
      title: "Memory-Analytics",
      desc: "Track what you have forgotten and identify weak concepts.",
    },
    {
      icon: <FaChartLine />,
      title: "Interview-Readiness",
      desc: "Measure how prepared you are for coding interviews.",
    },
    {
      icon: <FaBullseye />,
      title: "Smart-Recommendations",
      desc: "Get personalized problems based on your progress.",
    },
    {
      icon: <FaClock />,
      title: "Spaced-Revision",
      desc: "Revise problems before your memory fades.",
    },
  ];

  return (
    <section className="features" id="features">
      <h2>Why DSA Coach 2.0?</h2>
      <br />
      <div className="features-grid">
        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <div className="feature-icon">{feature.icon} </div>

            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
