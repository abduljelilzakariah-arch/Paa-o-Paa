"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") ?? "user";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    region: "Greater Accra",
    town: "Accra",
    role: defaultRole,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/verify");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] px-margin-mobile py-xl mt-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-xl">
          <h1 className="font-display text-display text-primary mb-2">Join the Craft</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Create your account to connect with artisans and opportunities across Ghana.
          </p>
        </div>

        <div className="bg-surface-white p-lg md:p-xl rounded-2xl shadow-card border border-border-tan">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <Input
                id="name"
                label="Full Name"
                placeholder="Kwame Mensah"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="kwame@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <Input
              id="phone"
              label="Phone Number"
              placeholder="+233 24 123 4567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <Input
              id="password"
              label="Create Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-xs block">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none"
                >
                  {["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Northern"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Input
                id="town"
                label="Town"
                placeholder="Accra"
                value={form.town}
                onChange={(e) => setForm({ ...form, town: e.target.value })}
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-xs block">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-sm">
                {[
                  { value: "user", label: "User", icon: "person" },
                  { value: "artisan", label: "Artisan", icon: "construction" },
                  { value: "business", label: "Business", icon: "storefront" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: type.value })}
                    className={`flex flex-col items-center gap-xs py-md rounded-xl border transition-all ${
                      form.role === type.value
                        ? "border-primary bg-primary-fixed/30 text-primary"
                        : "border-border-tan hover:border-primary/40"
                    }`}
                  >
                    <span className="material-symbols-outlined">{type.icon}</span>
                    <span className="font-label-caps text-[11px] uppercase">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-status-error font-body-sm bg-error-container px-md py-sm rounded-lg">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-lg font-body-sm text-on-surface-variant">
            Already registered?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
