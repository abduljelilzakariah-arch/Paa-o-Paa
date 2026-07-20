"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Apprenticeship, SessionUser } from "@/lib/types";

export default function ApprenticeshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Apprenticeship | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/apprenticeships/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setListing(d.listing);
        setLoading(false);
      });
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUser(d.user));
  }, [id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/apprenticeships/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplied(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-xxl">
        <h1 className="font-headline-lg text-headline-lg">Listing not found</h1>
        <Link href="/apprenticeships" className="text-primary mt-md inline-block">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <Link href="/apprenticeships" className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary mb-lg font-body-sm">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to apprenticeships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 bg-surface-white p-xl rounded-xl border border-border-tan shadow-card space-y-lg">
          <div className="flex flex-wrap gap-sm items-center">
            <Badge>{listing.trade}</Badge>
            <Badge variant="status">{listing.duration}</Badge>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface">{listing.title}</h1>
          <p className="font-body-lg text-body-lg text-primary">{listing.posterName}</p>

          <div className="grid grid-cols-2 gap-md py-md border-y border-border-tan">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Location</p>
              <p className="font-body-sm text-body-sm">{listing.town}, {listing.region}</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Stipend</p>
              <p className="font-body-sm text-body-sm text-primary font-bold">{listing.stipend}</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Schedule</p>
              <p className="font-body-sm text-body-sm">{listing.schedule}</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Deadline</p>
              <p className="font-body-sm text-body-sm">{formatDate(listing.deadline)}</p>
            </div>
          </div>

          <div>
            <h2 className="font-headline-sm text-headline-sm mb-sm">Description</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{listing.description}</p>
          </div>

          <div>
            <h2 className="font-headline-sm text-headline-sm mb-sm">Requirements</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{listing.requirements}</p>
          </div>
        </div>

        <div className="bg-surface-white p-xl rounded-xl border border-border-tan shadow-card sticky top-24 h-fit">
          <h2 className="font-headline-sm text-headline-sm mb-md">Apply Now</h2>

          {applied ? (
            <div className="text-center py-lg">
              <span className="material-symbols-outlined text-[48px] text-tertiary mb-md">check_circle</span>
              <p className="font-headline-sm text-headline-sm text-tertiary">Application Submitted!</p>
              <Link href="/profile/applications" className="text-primary font-body-sm mt-md inline-block hover:underline">
                View my applications
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-md">
              {user && (
                <div className="bg-surface-container-low p-md rounded-lg">
                  <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase mb-xs">Applying as</p>
                  <p className="font-body-sm text-body-sm font-bold">{user.name}</p>
                </div>
              )}
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs block">
                  Statement of Interest
                </label>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Tell them why you're interested..."
                  required
                  rows={5}
                  className="w-full px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-body-sm"
                />
              </div>
              {error && <p className="text-status-error font-body-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {user ? (submitting ? "Submitting..." : "Submit Application") : "Sign in to Apply"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
