"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { statusLabel, statusColor, formatDate } from "@/lib/utils";
import type { Application, Apprenticeship } from "@/lib/types";

type AppWithListing = Application & { listing?: Apprenticeship };

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<AppWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => {
        if (!r.ok) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setApplications(d.applications);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div className="skeleton h-48 rounded-xl" />;
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xl">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-xxl bg-surface-white rounded-xl border border-border-tan">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-md">description</span>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">No applications yet</h2>
          <Link href="/apprenticeships" className="text-primary font-body-sm mt-md inline-block hover:underline">
            Browse apprenticeships
          </Link>
        </div>
      ) : (
        <div className="space-y-md">
          {applications.map((app) => (
            <div key={app.id} className="bg-surface-white p-xl rounded-xl border border-border-tan shadow-card">
              <div className="flex flex-wrap justify-between items-start gap-md mb-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm">
                    {app.listing?.title ?? "Apprenticeship Listing"}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {app.listing?.posterName} · {app.listing?.town}
                  </p>
                </div>
                <span className={`px-md py-xs rounded-full font-label-caps text-label-caps ${statusColor(app.status)}`}>
                  {statusLabel(app.status)}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{app.statement}</p>
              <p className="font-label-caps text-[11px] text-on-surface-variant/50 mt-md">
                Applied {formatDate(app.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
