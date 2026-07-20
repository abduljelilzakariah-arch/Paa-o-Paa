"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(index: number, value: string) {
    if (value.length > 1) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const otp = code.join("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-margin-mobile py-xl">
      <div className="w-full max-w-md bg-surface-white p-xl rounded-2xl shadow-card border border-border-tan text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-md">verified_user</span>
        <h1 className="font-headline-lg text-headline-lg mb-sm">Verify Your Identity</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">
          Enter the 6-digit code sent to your phone. Demo: use any 6 digits (e.g. 123456).
        </p>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="flex justify-center gap-sm">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, ""))}
                className="w-12 h-14 text-center text-headline-md font-headline-md border-2 border-border-tan rounded-lg focus:border-primary outline-none"
              />
            ))}
          </div>

          {error && <p className="text-status-error font-body-sm">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading || code.some((d) => !d)}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}
