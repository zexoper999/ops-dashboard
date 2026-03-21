import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800">주간 매출 추이</h3>
          <p className="text-xs text-gray-400 mt-0.5">최근 7일 기준</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          매출액
        </div>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8" }}
            />
            <YAxis
              fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={36}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-slate-900 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl">
                    <p className="text-slate-400 mb-1">{String(label)}</p>
                    <p className="font-bold text-sm">
                      {Number(payload[0].value).toLocaleString()}원
                    </p>
                  </div>
                );
              }}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
