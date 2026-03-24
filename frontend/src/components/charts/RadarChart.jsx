import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function SkillsRadarChart({ data, ideal }) {
  // Support for dual dataset (Current vs Ideal)
  const chartData = data?.map((d, i) => ({
    trait: d.label,
    A: d.score,
    B: ideal ? ideal[i] : 80
  })) || [];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis 
            dataKey="trait" 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
          />
          <Radar
            name="Job Requirement"
            dataKey="B"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.2}
            strokeWidth={3}
          />
          <Radar
            name="Your Skills"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.5}
            strokeWidth={4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
