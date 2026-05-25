"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  List,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: CreditCard },
  { href: "/dashboard/transactions", label: "Transactions", icon: List },
  { href: "/dashboard/ai-advisor", label: "AI Advisor", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  name: string;
  email: string;
};

export function Sidebar({ name, email }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[180px] shrink-0 flex-col bg-[#1e1b3a]">
      <div className="flex items-center gap-2 px-4 pt-5">
        <span className="size-[26px] shrink-0 rounded-md bg-[#6C63FF]" />
        <span className="text-lg font-semibold text-white">Riddhi</span>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-0.5 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md border-r-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-[#6C63FF] bg-[rgba(108,99,255,0.25)] text-[#a89ff5] hover:bg-[rgba(108,99,255,0.35)] hover:text-[#a89ff5]"
                  : "border-transparent text-gray-400 hover:bg-[rgba(108,99,255,0.15)] hover:text-[#a89ff5]"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6C63FF] text-xs font-semibold text-white">
          {getInitials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="truncate text-xs text-gray-400">{email}</p>
        </div>
      </div>
    </aside>
  );
}
