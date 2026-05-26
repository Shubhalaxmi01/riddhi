"use client";

import { useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import {
  EditTransactionModal,
  type TransactionType,
} from "@/components/transactions/EditTransactionModal";

const FILTER_CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Bills",
  "Income",
  "Shopping",
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Food: { bg: "#ede9ff", text: "#534AB7" },
  Income: { bg: "#e6faf3", text: "#0F6E56" },
  Transport: { bg: "#fff3e8", text: "#993C1D" },
  Bills: { bg: "#e6f1fb", text: "#185FA5" },
  Shopping: { bg: "#fef3c7", text: "#92400e" },
};

type TransactionsClientProps = {
  transactions: TransactionType[];
  accounts: { id: string; name: string }[];
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

export function TransactionsClient({
  transactions: initialTransactions,
  accounts,
}: TransactionsClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionType | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesSearch = !q || tx.title.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || tx.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, activeCategory]);

  function handleAdd(txn: TransactionType) {
    setTransactions((prev) =>
      [txn, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }

  function handleEdit(txn: TransactionType) {
    setTransactions((prev) =>
      prev
        .map((t) => (t.id === txn.id ? txn : t))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    );
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <main className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">Transactions</h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg border-[#6C63FF] text-[#6C63FF] hover:bg-[#ede9ff]"
          >
            Import CSV
          </Button>
          <Button
            type="button"
            className="rounded-lg bg-[#6C63FF] text-white hover:bg-[#5a52e0]"
            onClick={() => setShowAddModal(true)}
          >
            + Add
          </Button>
        </div>
      </div>

      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search transactions..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search transactions"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: "#ede9ff", color: "#534AB7", borderColor: "#ede9ff" }
                  : { backgroundColor: "#f8f9fc", color: "#888", borderColor: "#eee" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-lg border bg-white"
        style={{ borderColor: "#e8e6ff" }}
      >
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No transactions found
          </p>
        ) : (
          <ul>
            {filtered.map((tx) => {
              const isPositive = tx.amount >= 0;
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                  style={{ borderColor: "#e8e6ff" }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#1a1a2e]">
                      {tx.title}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {tx.accounts.name}
                    </p>
                  </div>

                  <CategoryBadge category={tx.category} />

                  <span className="hidden shrink-0 text-sm text-gray-600 sm:block">
                    {formatDate(tx.date)}
                  </span>

                  <span
                    className="shrink-0 text-sm font-semibold"
                    style={{ color: isPositive ? "#1D9E75" : "#E24B4A" }}
                  >
                    {isPositive ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#6C63FF]"
                      aria-label={`Edit ${tx.title}`}
                      onClick={() => setEditingTransaction(tx)}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#E24B4A]"
                      aria-label={`Delete ${tx.title}`}
                      onClick={() => handleDelete(tx.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showAddModal && (
        <AddTransactionModal
          accounts={accounts}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          accounts={accounts}
          onEdit={handleEdit}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </main>
  );
}
