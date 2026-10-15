import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    title: "Connect LeetCode Profile",
    desc: "Link your username and we import your solved problems.",
  },
  {
    title: "Analyze Solving Patterns",
    desc: "Find which topics and patterns you're strong or weak in.",
  },
  {
    title: "Get Smart Recommendations",
    desc: "Receive problems picked for your gaps, not at random.",
  },
  {
    title: "Track Memory Retention",
    desc: "See what you're starting to forget before it's gone.",
  },
  {
    title: "Improve Interview Readiness",
    desc: "Watch your readiness score climb as you revise.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // heading
      gsap.from("h2", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "h2", start: "top 85%" },
      });

      // the line fills as you scroll through the timeline
      gsap.fromTo(
        ".timeline-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );

      gsap.utils.toArray(".timeline-item").forEach((item) => {
        // slide the card in
        gsap.from(item.querySelector(".step-content"), {
          x: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all", // so your CSS hover transform still works afterwards
          scrollTrigger: { trigger: item, start: "top 85%" },
        });

        // light up the number when the line reaches it (reverses on scroll up)
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          toggleClass: { targets: item, className: "active" },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="how-it-works" id="how-it-works" ref={sectionRef}>
      <h2>How It Works</h2>

      <div className="timeline">
        <div className="timeline-line">
          <div className="timeline-progress" />
        </div>

        {steps.map((step, index) => (
          <div key={step.title} className="timeline-item">
            <div className="step-number">{index + 1}</div>

            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
