"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { statusLabel, statusColor } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [form, setForm] = useState({ name: "", region: "", town: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => {
        if (!r.ok) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setUser(d.user);
          setForm({ name: d.user.name, region: d.user.region, town: d.user.town });
        }
        setLoading(false);
      });
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage("Profile updated successfully!");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="skeleton h-64 rounded-xl" />;
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-xl">
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="bg-surface-white p-xl rounded-xl border border-border-tan shadow-card">
          <div className="flex items-center gap-lg mb-xl">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[32px]">person</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm">{user.name}</h2>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">{user.role}</p>
            </div>
          </div>

          <div className="space-y-sm font-body-sm text-on-surface-variant mb-xl">
            <p className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              {user.email}
            </p>
            <p className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {user.town}, {user.region}
            </p>
          </div>

          <Link href="/explore">
            <Button variant="secondary" className="w-full mb-sm">
              <span className="material-symbols-outlined">explore</span>
              Explore Hub
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-2 bg-surface-white p-xl rounded-xl border border-border-tan shadow-card">
          <h2 className="font-headline-sm text-headline-sm mb-lg">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-lg">
            <Input
              id="name"
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              id="region"
              label="Region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
            <Input
              id="town"
              label="Town"
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
            />
            {message && (
              <p className="text-tertiary font-body-sm bg-tertiary-fixed px-md py-sm rounded-lg">{message}</p>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
