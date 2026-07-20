"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const role = data.user?.role;
      if (role === "artisan" || role === "business") {
        router.push("/dashboard");
      } else if (role === "user") {
        router.push("/explore");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="craft-pattern min-h-[80vh] flex flex-col">
      <div className="flex-grow flex items-center justify-center px-margin-mobile py-xl mt-8">
        <div className="w-full max-w-lg bg-surface-white/90 p-xl md:p-8 rounded-2xl shadow-elevated border border-outline-variant/20">
          <div className="text-center mb-xl">
            <h1 className="font-headline-lg text-headline-lg mb-3 text-on-surface">Welcome Back</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Access your craftsmanship tools and connect with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <Input
              id="identifier"
              label="Email or Phone"
              placeholder="user@demo.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <div>
              <div className="flex justify-between items-end mb-xs">
                <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Password
                </label>
                <Link href="/reset-password" className="font-label-caps text-[11px] text-primary hover:underline uppercase">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-status-error font-body-sm text-body-sm bg-error-container px-md py-sm rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              New to the hub?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-lg p-md bg-surface-container-low rounded-xl border border-border-tan">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">Demo Accounts</p>
              <div className="space-y-xs text-body-sm text-on-surface-variant text-left">
                <p><strong>User:</strong> user@demo.com / demo123</p>
                <p><strong>Artisan:</strong> artisan@demo.com / demo123</p>
                <p><strong>Business:</strong> business@demo.com / demo123</p>
                <p className="text-on-surface-variant/70 mt-sm">Artisan & business → dashboard. Customer → Explore Hub.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
