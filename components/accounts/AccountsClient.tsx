"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreditCard, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAccountModal } from "@/components/accounts/AddAccountModal";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
};

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  account_id: string;
  accounts?: { name: string } | null;
};

type AccountsClientProps = {
  userId: string;
  accounts: Account[];
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
    currency: "CAD",
  }).format(abs);
}

function formatDate(dateStr: string) {
  const date = new Date(
    dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`
  );
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function currentYearMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function CategoryBadge({ category }: { category: string }) {
  const style = categoryStyles[category] ?? { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      className="inline-block shrink-0 rounded px-2 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {category}
    </span>
  );
}

function AccountIcon({ type }: { type: string }) {
  if (type === "Savings") {
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#e6faf3]">
        <PiggyBank className="size-5 text-[#1D9E75]" />
      </div>
    );
  }

  if (type === "Credit") {
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#fee2e2]">
        <CreditCard className="size-5 text-[#E24B4A]" />
      </div>
    );
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-[#ede9ff]">
      <CreditCard className="size-5 text-[#6C63FF]" />
    </div>
  );
}

export function AccountsClient({
  userId,
  accounts: initialAccounts,
  transactions,
}: AccountsClientProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showAddModal, setShowAddModal] = useState(false);

  const monthKey = currentYearMonth();

  const accountSummaries = useMemo(() => {
    return accounts.map((account) => {
      const accountTransactions = transactions.filter(
        (tx) => tx.account_id === account.id
      );
      const lastTransaction = accountTransactions[0] ?? null;
      const monthSpent = accountTransactions
        .filter((tx) => tx.date.startsWith(monthKey) && tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      return {
        ...account,
        lastTransaction,
        monthSpent,
      };
    });
  }, [accounts, monthKey, transactions]);

  function handleAdd(account: Account) {
    setAccounts((prev) => [...prev, account]);
  }

  return (
    <main className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">Accounts</h1>
        <Button
          type="button"
          className="rounded-lg bg-[#6C63FF] text-white hover:bg-[#5a52e0]"
          onClick={() => setShowAddModal(true)}
        >
          + Add Account
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {accountSummaries.map((account) => {
          const lastAmount = account.lastTransaction?.amount ?? 0;
          const lastIsPositive = lastAmount >= 0;

          return (
            <div
              key={account.id}
              className="rounded-[10px] border bg-white p-4"
              style={{ borderColor: "#e8e6ff" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{account.type}</p>
                  <p className="mt-1 text-3xl font-bold text-[#1a1a2e]">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#1a1a2e]">
                    {account.name}
                  </p>
                </div>
                <AccountIcon type={account.type} />
              </div>

              <div
                className="my-4 border-t"
                style={{ borderColor: "#e8e6ff" }}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Last transaction</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: lastIsPositive ? "#1D9E75" : "#E24B4A" }}
                  >
                    {account.lastTransaction
                      ? `${lastIsPositive ? "+" : "-"}${formatCurrency(lastAmount)}`
                      : "No transactions"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">This month</span>
                  <span className="text-sm font-semibold text-[#E24B4A]">
                    -{formatCurrency(account.monthSpent)}
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/transactions"
                className="mt-4 inline-block text-sm font-medium hover:underline"
                style={{ color: "#6C63FF" }}
              >
                View transactions
              </Link>
            </div>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-lg border bg-white"
        style={{ borderColor: "#e8e6ff" }}
      >
        <div
          className="border-b px-4 py-3"
          style={{ borderColor: "#e8e6ff" }}
        >
          <h2 className="text-sm font-semibold text-[#1a1a2e]">
            All Transactions
          </h2>
        </div>

        {transactions.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No transactions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className="border-b text-[10px] text-gray-500"
                  style={{ borderColor: "#e8e6ff" }}
                >
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
                        <p className="text-[10px] text-gray-500">
                          {tx.accounts?.name ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={tx.category} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(tx.date)}
                      </td>
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
        )}
      </div>

      {showAddModal && (
        <AddAccountModal
          userId={userId}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </main>
  );
}
