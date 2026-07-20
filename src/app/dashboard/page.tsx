"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import type { DashboardStats, Apprenticeship } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [listings, setListings] = useState<Apprenticeship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setListings(d.listings ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-lg">
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-sm">
          Your Dashboard
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Track who&apos;s finding you and manage apprenticeship requests in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
        <StatCard label="Profile Views" value={stats.profileViews} icon="visibility" accent="primary" />
        <StatCard label="Contact Requests" value={stats.contactRequests} icon="call" accent="secondary" />
        <StatCard label="Pending Applications" value={stats.pendingApplications} icon="pending_actions" accent="warning" />
        <StatCard label="Total Applications" value={stats.totalApplications} icon="group" accent="tertiary" />
        <StatCard label="Active Listings" value={stats.activeListings} icon="work" accent="primary" />
        {stats.rating > 0 && (
          <StatCard label="Your Rating" value={stats.rating.toFixed(1)} icon="star" accent="secondary" />
        )}
      </div>

      {stats.pendingApplications > 0 && (
        <div className="bg-secondary-container/20 border border-secondary-container rounded-xl p-lg flex flex-wrap items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-secondary text-[32px]">notifications_active</span>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {stats.pendingApplications} application{stats.pendingApplications !== 1 ? "s" : ""} waiting
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Review and approve apprenticeship requests
              </p>
            </div>
          </div>
          <Link href="/dashboard/applications">
            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-headline-sm text-headline-sm hover:bg-primary-container transition-all">
              Review Now
            </button>
          </Link>
        </div>
      )}

      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Your Listings</h2>
        {listings.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">No active listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-surface-container-low rounded-xl border border-border-tan p-lg"
              >
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{listing.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
                  {listing.trade} · {listing.town}
                </p>
                <span className="font-label-caps text-label-caps text-primary">{listing.stipend}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
