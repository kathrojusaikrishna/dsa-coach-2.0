import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    })
      .from(
        textRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5",
      )
      .from(
        buttonsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4",
      )
      .from(
        ".preview-header",
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
        },
        "-=0.3",
      )
      .from(
        ".feature-box, .recommend-box",
        {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.7,
        },
        "-=0.2",
      );

    gsap.to(".hero-right", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 ref={titleRef} className="hero-title">
          Stop Solving.
          <br />
          Start Retaining.
        </h1>

        <p ref={textRef} className="hero-text">
          An AI-powered DSA coach that tracks what you forget, identifies weak
          patterns, and predicts interview readiness.
        </p>

        <div ref={buttonsRef} className="hero-buttons">
          <button className="primary-btn">Get Started</button>
          <button
            className="secondary-btn"
            onClick={() => {
              document.getElementById("how-it-works")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            View Demo
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="dashboard-preview">
          <div className="preview-header"> Sample Dashboard Preview</div>

          <div className="feature-box">
            <h4>Memory Analytics</h4>
            <p>Track forgotten concepts and retention trends.</p>
          </div>

          <div className="feature-box">
            <h4>Interview Readiness</h4>
            <p>AI-generated readiness score based on performance.</p>
          </div>

          <div className="feature-box">
            <h4>Weak Topics</h4>
            <p>Graphs, DP, Backtracking</p>
          </div>

          <div className="recommend-box">
            <h4>Recommended Next</h4>

            <div className="problem">
              <span>Top K Frequent Elements</span>
              <span className="tag">Medium</span>
            </div>

            <div className="problem">
              <span>Course Schedule</span>
              <span className="tag">Medium</span>
            </div>

            <div className="problem">
              <span>Clone Graph</span>
              <span className="tag">Medium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
