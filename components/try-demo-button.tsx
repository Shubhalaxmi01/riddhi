"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInDemo } from '@/app/login/actions'

export function TryDemoButton() {
  const [loading, setLoading] = useState(false);

  async function handleDemo() {
    setLoading(true)
    const result = await signInDemo()
    if (result?.error) {
      console.error(result.error)
      setLoading(false)
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