import Link from "next/link";
import { LayoutGrid, ListChecks, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TryDemoButton } from "@/components/try-demo-button";

const features = [
  {
    title: "Smart Dashboard",
    description:
      "All your finances at a glance. Monthly totals, trends, and category breakdowns in one view.",
    icon: LayoutGrid,
    iconBg: "bg-[#6C63FF]/10",
    iconColor: "text-[#6C63FF]",
  },
  {
    title: "Transactions",
    description:
      "Track every CAD you spend. Log manually or upload receipts - no bank connection needed.",
    icon: ListChecks,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "AI Advisor",
    description:
      "Ask anything about your money. Get personalized tips based on your real spending habits.",
    icon: MessageCircle,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-full bg-white">
      <header className="bg-black">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="size-9 shrink-0 rounded-md bg-[#6C63FF]" />
            <span className="text-lg font-semibold text-white">Riddhi</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              About
            </Link>
            <Button
              asChild
              className="h-10 rounded-full bg-[#6C63FF] px-5 text-sm font-semibold text-white hover:bg-[#5b54e8]"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full bg-[#6C63FF]/10 px-4 py-1.5 text-sm font-medium text-[#6C63FF]">
            AI-powered finance tracker
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Know exactly where your money is going
          </h1>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TryDemoButton />
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#6C63FF] px-8 text-base font-semibold text-[#6C63FF] hover:bg-[#6C63FF]/5"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </section>

        <hr className="border-gray-200" />

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold text-[#6C63FF]">
            Everything You Need
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <div
                    className={`mb-5 flex size-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                  >
                    <Icon className={`size-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="about"
          className="border-t border-gray-100 bg-gray-50 px-6 py-16 text-center"
        >
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            Riddhi helps you understand your spending without connecting your
            bank. Built for clarity, powered by AI.
          </p>
        </section>
      </main>
    </div>
  );
}
