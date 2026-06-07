import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressRing({ value, title }) {
  return (
    <div
      style={{
        width: "160px",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#7c3aed",
          trailColor: "#1f2937",
        })}
      />

      <h3>{title}</h3>
    </div>
  );
}
