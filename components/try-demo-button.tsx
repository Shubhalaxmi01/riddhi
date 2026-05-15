"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function TryDemoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDemo() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@riddhi.com",
      password: "demo1234",
    });
    setLoading(false);
    if (!error) {
      router.push("/dashboard");
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDemo}
      disabled={loading}
      className="h-12 rounded-full bg-[#6C63FF] px-8 text-base font-semibold text-white hover:bg-[#5b54e8]"
    >
      {loading ? "Signing in…" : "Try Demo - No signup"}
    </Button>
  );
}
