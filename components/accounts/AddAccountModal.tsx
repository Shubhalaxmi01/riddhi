"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

type AccountType = "Checking" | "Savings" | "Credit";

type AddAccountModalProps = {
  onAdd: (account: any) => void;
  onClose: () => void;
  userId: string;
};

const selectClassName =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function AddAccountModal({
  onAdd,
  onClose,
  userId,
}: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("Checking");
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedBalance = parseFloat(balance);

    if (!name.trim() || Number.isNaN(parsedBalance)) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("accounts")
      .insert({
        user_id: userId,
        name: name.trim(),
        type,
        balance: parsedBalance,
      })
      .select("*")
      .single();

    setSubmitting(false);

    if (error || !data) return;

    onAdd(data);
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
        aria-labelledby="add-account-title"
      >
        <h2
          id="add-account-title"
          className="mb-5 text-lg font-semibold text-[#1a1a2e]"
        >
          Add Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Account Name
            </label>
            <Input
              placeholder="e.g. TD Chequing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Account Type
            </label>
            <select
              className={selectClassName}
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
            >
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Current Balance
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
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
              Add Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
