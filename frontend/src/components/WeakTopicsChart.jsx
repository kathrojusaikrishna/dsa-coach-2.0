import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function WeakTopicsChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Least Practiced Topics</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="topic" tick={{ fill: "#fff" }} />

          <YAxis tick={{ fill: "#fff" }} />

          <Tooltip />

          <Bar dataKey="solvedCount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
