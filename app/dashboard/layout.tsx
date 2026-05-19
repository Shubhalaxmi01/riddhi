import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";
  const email = user.email ?? "";

  return (
    <div className="flex h-screen">
      <Sidebar name={name} email={email} />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
