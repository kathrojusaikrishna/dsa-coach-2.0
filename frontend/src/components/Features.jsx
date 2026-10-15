import React, { useRef } from "react";
import {
  FaBrain,
  FaChartLine,
  FaBullseye,
  FaClock,
  FaComments,
  FaBriefcase,
} from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  {
    icon: <FaComments />,
    title: "Global-Discussion",
    desc: "Chat with other DSA learners, share approaches and get unstuck together.",
  },
  {
    icon: <FaBriefcase />,
    title: "Job-Postings",
    desc: "Browse and post job openings so your prep leads somewhere.",
  },
];

export default function Features() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray(".feature-card").forEach((card) => {
        // cards already visible on load stay fully crisp
        if (card.getBoundingClientRect().left < window.innerWidth * 0.9) return;

        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 95%",
              end: "left 60%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="features" id="features" ref={sectionRef}>
      <h2>Why DSA Coach 2.0?</h2>
      <div className="features-grid" ref={trackRef}>
        {features.map((feature, i) => (
          <div className="feature-card" key={feature.title}>
            <span className="feature-index">0{i + 1}</span>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
