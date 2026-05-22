"use client";

type MetricCardsProps = {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function ChangeIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className="text-[10px] font-medium"
      style={{ color: isPositive ? "#1D9E75" : "#E24B4A" }}
    >
      {isPositive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

const cards = [
  { label: "Total Balance", key: "totalBalance" as const, changeKey: "balanceChange" as const },
  { label: "Income", key: "income" as const, changeKey: "incomeChange" as const },
  { label: "Expenses", key: "expenses" as const, changeKey: "expensesChange" as const },
  { label: "Savings", key: "savings" as const, changeKey: "savingsChange" as const },
];

export function MetricCards(props: MetricCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(({ label, key, changeKey }) => (
        <div
          key={label}
          className="bg-white"
          style={{
            border: "1px solid #e8e6ff",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <p className="text-[10px] text-gray-500">{label}</p>
          <p
            className="mt-1 text-xl font-bold"
            style={{ color: "#1a1a2e" }}
          >
            {formatCurrency(props[key])}
          </p>
          <div className="mt-1">
            <ChangeIndicator value={props[changeKey]} />
          </div>
        </div>
      ))}
    </div>
  );
}
