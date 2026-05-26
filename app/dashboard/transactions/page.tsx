import { createSupabaseServerClient } from "@/lib/supabase-server";
import { TransactionsClient } from "@/components/transactions/TransactionsClient";

type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  account_id: string;
  accounts: { name: string } | null;
};

type AccountRow = {
  id: string;
  name: string;
};

export default async function TransactionsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, accounts(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name")
    .eq("user_id", user.id);

  const txRows = (transactions ?? []).map((t) => {
    const row = t as TransactionRow;
    return {
      id: row.id,
      title: row.title,
      amount: row.amount,
      category: row.category,
      date: row.date,
      account_id: row.account_id,
      accounts: { name: row.accounts?.name ?? "" },
    };
  });

  return (
    <TransactionsClient
      transactions={txRows}
      accounts={(accounts ?? []) as AccountRow[]}
    />
  );
}
