"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Income",
  "Shopping",
  "Other",
] as const;

export type TransactionType = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  account_id: string;
  accounts: { name: string };
};

type EditTransactionModalProps = {
  transaction: TransactionType;
  accounts: { id: string; name: string }[];
  onEdit: (txn: TransactionType) => void;
  onClose: () => void;
};

const selectClassName =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function EditTransactionModal({
  transaction,
  accounts,
  onEdit,
  onClose,
}: EditTransactionModalProps) {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(String(Math.abs(transaction.amount)));
  const [type, setType] = useState<"expense" | "income">(
    transaction.amount < 0 ? "expense" : "income"
  );
  const [category, setCategory] = useState(transaction.category);
  const [accountId, setAccountId] = useState(transaction.account_id);
  const [date, setDate] = useState(transaction.date.split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || !accountId || Number.isNaN(parsedAmount)) return;

    setSubmitting(true);

    const signedAmount =
      type === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    const { data, error } = await supabase
      .from("transactions")
      .update({
        account_id: accountId,
        title: title.trim(),
        amount: signedAmount,
        category,
        date,
      })
      .eq("id", transaction.id)
      .select("*, accounts(name)")
      .single();

    setSubmitting(false);

    if (error || !data) return;

    const accountName =
      (data.accounts as { name: string } | null)?.name ??
      accounts.find((a) => a.id === accountId)?.name ??
      "";

    onEdit({
      id: data.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      account_id: data.account_id,
      accounts: { name: accountName },
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-[400px] rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="edit-transaction-title"
      >
        <h2
          id="edit-transaction-title"
          className="mb-5 text-lg font-semibold text-[#1a1a2e]"
        >
          Edit Transaction
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Title
            </label>
            <Input
              placeholder="e.g. Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  type === "expense"
                    ? "border-[#6C63FF] bg-[#ede9ff] text-[#534AB7]"
                    : "border-[#eee] bg-[#f8f9fc] text-[#888]"
                )}
                onClick={() => setType("expense")}
              >
                Expense
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  type === "income"
                    ? "border-[#6C63FF] bg-[#ede9ff] text-[#534AB7]"
                    : "border-[#eee] bg-[#f8f9fc] text-[#888]"
                )}
                onClick={() => setType("income")}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Category
            </label>
            <select
              className={selectClassName}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Account
            </label>
            <select
              className={selectClassName}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-[#6C63FF] text-[#6C63FF] hover:bg-[#ede9ff]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#6C63FF] text-white hover:bg-[#5a52e0]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
