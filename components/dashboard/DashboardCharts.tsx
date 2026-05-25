"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type BarDatum = { month: string; income: number; spending: number };
type DonutDatum = { name: string; value: number; color: string };

type DashboardChartsProps = {
  barData: BarDatum[];
  donutData: DonutDatum[];
  donutTotal: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

export function DashboardCharts({
  barData,
  donutData,
  donutTotal,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-[1.6fr_1fr] gap-4">
      <div
        className="rounded-lg border bg-white p-4"
        style={{ borderColor: "#e8e6ff" }}
      >
        <h3 className="text-sm font-semibold text-[#1a1a2e]">
          Income vs Spending
        </h3>
        <p className="text-[10px] text-gray-500">Last 6 months</p>
        <div style={{ minHeight: 220 }} className="mt-3">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#888" }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value as number))}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Bar dataKey="income" name="Income" fill="#6C63FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spending" name="Spending" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="rounded-lg border bg-white p-4"
        style={{ borderColor: "#e8e6ff" }}
      >
        <h3 className="text-sm font-semibold text-[#1a1a2e]">
          Spending By Category
        </h3>
        <p className="text-[10px] text-gray-500">This month</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative flex-1" style={{ minHeight: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value as number))}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] text-gray-500">Total</p>
                <p className="text-sm font-bold text-[#1a1a2e]">
                  {formatCurrency(donutTotal)}
                </p>
              </div>
            </div>
          </div>

          <ul className="flex min-w-[100px] flex-col gap-2">
            {donutData.map((entry) => {
              const pct =
                donutTotal > 0
                  ? ((entry.value / donutTotal) * 100).toFixed(0)
                  : "0";
              return (
                <li
                  key={entry.name}
                  className="flex items-center gap-1.5 text-[11px] text-[#1a1a2e]"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 truncate">{entry.name}</span>
                  <span className="text-gray-500">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
