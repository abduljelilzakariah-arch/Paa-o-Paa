"use client";

import { useEffect, useState } from "react";
import { ApplicationManageCard } from "@/components/dashboard/ApplicationManageCard";
import type { ApplicationWithListing } from "@/lib/types";

export default function DashboardApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithListing[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/applications")
      .then((r) => r.json())
      .then((d) => {
        setApplications(d.applications ?? []);
        setLoading(false);
      });
  }, []);

  async function handleUpdate(id: string, status: ApplicationWithListing["status"]) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.application } : a))
      );
    }
  }

  const filtered = applications.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return a.status === "submitted" || a.status === "under_review";
    return a.status === filter;
  });

  const pendingCount = applications.filter(
    (a) => a.status === "submitted" || a.status === "under_review"
  ).length;

  if (loading) {
    return (
      <div className="space-y-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-sm">
          Apprenticeship Requests
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Review people who want to join your apprenticeship programmes. Approve or decline with one click.
        </p>
      </div>

      <div className="flex flex-wrap gap-sm">
        {(
          [
            { key: "all", label: `All (${applications.length})` },
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "accepted", label: "Approved" },
            { key: "declined", label: "Declined" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-md py-sm rounded-full font-label-caps text-label-caps transition-all ${
              filter === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-xxl bg-surface-white rounded-xl border border-border-tan">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-md">
            inbox
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">
            No applications in this category
          </h2>
        </div>
      ) : (
        <div className="space-y-md">
          {filtered.map((app) => (
            <ApplicationManageCard key={app.id} application={app} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
