import Link from "next/link";
import { Bell, Search, Sparkles } from "lucide-react";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Input } from "@/components/ui/input";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DONUT_COLORS: Record<string, string> = {
  Food: "#6C63FF",
  Transport: "#F97316",
  Bills: "#1D9E75",
  Shopping: "#F59E0B",
  Other: "#888888",
};

type Account = { balance: number };
type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  accounts: { name: string } | null;
};

function yearMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function calcMonthMetrics(transactions: TransactionRow[], ym: string) {
  const monthTx = transactions.filter((t) => t.date.startsWith(ym));
  const income = monthTx
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTx
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return { income, expenses, savings: income - expenses };
}

function percentChange(current: number, last: number) {
  if (last === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - last) / last) * 1000) / 10;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id);

  // console.log('user id:', user.id)
  // console.log('accounts:', accounts)

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, accounts(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  
  // console.log('transactions:', transactions)

  const accountRows = (accounts ?? []) as Account[];
  const txRows = (transactions ?? []) as TransactionRow[];

  const totalBalance = accountRows.reduce((sum, a) => sum + (a.balance ?? 0), 0);

  const now = new Date();
  const currentYm = yearMonth(now);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastYm = yearMonth(lastMonthDate);

  const current = calcMonthMetrics(txRows, currentYm);
  const last = calcMonthMetrics(txRows, lastYm);

  const estimatedLastBalance = totalBalance - current.savings;
  const balanceChange = percentChange(totalBalance, estimatedLastBalance);
  const incomeChange = percentChange(current.income, last.income);
  const expensesChange = percentChange(current.expenses, last.expenses);
  const savingsChange = percentChange(current.savings, last.savings);

  const barData: { month: string; income: number; spending: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = yearMonth(d);
    const metrics = calcMonthMetrics(txRows, ym);
    barData.push({
      month: MONTH_LABELS[d.getMonth()],
      income: metrics.income,
      spending: metrics.expenses,
    });
  }

  const currentMonthExpenses = txRows.filter(
    (t) => t.date.startsWith(currentYm) && t.amount < 0
  );
  const categoryTotals: Record<string, number> = {};
  for (const t of currentMonthExpenses) {
    const cat = t.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + Math.abs(t.amount);
  }

  const donutData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: DONUT_COLORS[name] ?? DONUT_COLORS.Other,
  }));
  const donutTotal = donutData.reduce((sum, d) => sum + d.value, 0);

  const topCategory =
    donutData.length > 0
      ? [...donutData].sort((a, b) => b.value - a.value)[0].name
      : "N/A";

  const recentTransactions = txRows.slice(0, 5).map((t) => ({
    id: t.id,
    title: t.title,
    amount: t.amount,
    category: t.category,
    date: t.date,
    account_name: t.accounts?.name ?? "",
  }));

  return (
    <main className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-4">
        <h1 className="shrink-0 text-2xl font-semibold text-[#1a1a2e]">Dashboard</h1>
        <div className="mx-auto w-full max-w-[280px]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-9"
              readOnly
              aria-label="Search"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="text-gray-500 hover:text-[#1a1a2e]"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <span className="flex size-9 items-center justify-center rounded-full bg-[#6C63FF] text-xs font-semibold text-white">
            RD
          </span>
        </div>
      </div>

      <MetricCards
        totalBalance={totalBalance}
        income={current.income}
        expenses={current.expenses}
        savings={current.savings}
        balanceChange={balanceChange}
        incomeChange={incomeChange}
        expensesChange={expensesChange}
        savingsChange={savingsChange}
      />

      <DashboardCharts
        barData={barData}
        donutData={donutData}
        donutTotal={donutTotal}
      />

      <RecentTransactions transactions={recentTransactions} />

      <Link
        href="/dashboard/ai-advisor"
        className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#fffbf0", borderColor: "#f5c842" }}
      >
        <Sparkles className="size-5 shrink-0 text-[#d97706]" />
        <p className="text-sm text-[#1a1a2e]">
          You spent {formatCurrency(current.expenses)} this month. Your top
          category is {topCategory}.{" "}
          <span className="font-medium" style={{ color: "#6C63FF" }}>
            Ask AI Advisor →
          </span>
        </p>
      </Link>
    </main>
  );
}
