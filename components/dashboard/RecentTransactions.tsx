"use client";

import Link from "next/link";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  account_name: string;
};

type RecentTransactionsProps = {
  transactions: Transaction[];
};

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Food: { bg: "#ede9ff", text: "#534AB7" },
  Income: { bg: "#e6faf3", text: "#0F6E56" },
  Transport: { bg: "#fff3e8", text: "#993C1D" },
  Bills: { bg: "#e6f1fb", text: "#185FA5" },
  Shopping: { bg: "#fef3c7", text: "#92400e" },
};

function formatCurrency(amount: number) {
  const abs = Math.abs(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(abs);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CategoryBadge({ category }: { category: string }) {
  const style = categoryStyles[category] ?? { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {category}
    </span>
  );
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div
      className="rounded-lg border bg-white"
      style={{ borderColor: "#e8e6ff" }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#e8e6ff" }}>
        <h3 className="text-sm font-semibold text-[#1a1a2e]">Recent Transactions</h3>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-medium hover:underline"
          style={{ color: "#6C63FF" }}
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[10px] text-gray-500" style={{ borderColor: "#e8e6ff" }}>
              <th className="px-4 py-2 font-medium">Description</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isPositive = tx.amount >= 0;
              return (
                <tr
                  key={tx.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "#e8e6ff" }}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1a1a2e]">{tx.title}</p>
                    <p className="text-[10px] text-gray-500">{tx.account_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={tx.category} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(tx.date)}</td>
                  <td
                    className="px-4 py-3 text-right font-semibold"
                    style={{ color: isPositive ? "#1D9E75" : "#E24B4A" }}
                  >
                    {isPositive ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
