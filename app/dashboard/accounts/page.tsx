import { AccountsClient } from "@/components/accounts/AccountsClient";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type AccountRow = {
  id: string;
  name: string;
  type: string;
  balance: number;
};

type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  account_id: string;
  accounts: { name: string } | null;
};

export default async function AccountsPage() {
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

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, accounts(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const accountRows = ((accounts ?? []) as AccountRow[]).map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.balance ?? 0,
  }));

  const transactionRows = ((transactions ?? []) as TransactionRow[]).map((tx) => ({
    id: tx.id,
    title: tx.title,
    amount: tx.amount,
    category: tx.category,
    date: tx.date,
    account_id: tx.account_id,
    accounts: tx.accounts,
  }));

  return (
    <AccountsClient
      userId={user.id}
      accounts={accountRows}
      transactions={transactionRows}
    />
  );
}
