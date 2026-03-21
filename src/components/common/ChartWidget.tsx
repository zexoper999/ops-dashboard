import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// fake data
const data = [
  { name: "1일", revenue: 4000 },
  { name: "2일", revenue: 3000 },
  { name: "3일", revenue: 2000 },
  { name: "4일", revenue: 2780 },
  { name: "5일", revenue: 1890 },
  { name: "6일", revenue: 2390 },
  { name: "7일", revenue: 3490 },
];

export default function ChartWidget() {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">주간 매출 추이</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => `${value}원`}
              width={80}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()}원`, "매출"]}
              labelStyle={{ color: "#374151" }}
            />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
