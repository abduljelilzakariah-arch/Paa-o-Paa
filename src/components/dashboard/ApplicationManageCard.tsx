"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { statusLabel, statusColor, formatDate } from "@/lib/utils";
import type { ApplicationWithListing } from "@/lib/types";

interface ApplicationManageCardProps {
  application: ApplicationWithListing;
  onUpdate: (id: string, status: ApplicationWithListing["status"]) => Promise<void>;
}

export function ApplicationManageCard({ application, onUpdate }: ApplicationManageCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function handleAction(status: ApplicationWithListing["status"]) {
    setLoading(status);
    try {
      await onUpdate(application.id, status);
    } finally {
      setLoading(null);
    }
  }

  const isPending =
    application.status === "submitted" || application.status === "under_review";

  return (
    <div className="bg-surface-white rounded-xl border border-border-tan shadow-card overflow-hidden transition-all hover:shadow-elevated">
      <div className="p-lg">
        <div className="flex flex-wrap items-start justify-between gap-md mb-md">
          <div className="flex items-start gap-md">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {application.applicantName}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {application.listing?.title ?? "Apprenticeship"}
              </p>
              <p className="font-label-caps text-[11px] text-on-surface-variant/60 mt-xs">
                Applied {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
          <span
            className={`px-md py-xs rounded-full font-label-caps text-label-caps ${statusColor(application.status)}`}
          >
            {statusLabel(application.status)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-xs text-primary font-body-sm text-body-sm hover:underline mb-md"
        >
          <span className="material-symbols-outlined text-[18px]">
            {expanded ? "expand_less" : "expand_more"}
          </span>
          {expanded ? "Hide" : "Read"} statement of interest
        </button>

        {expanded && (
          <div className="bg-surface-container-low rounded-lg p-md mb-md border border-border-tan/50">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {application.statement}
            </p>
          </div>
        )}

        {isPending && (
          <div className="flex flex-wrap gap-sm pt-md border-t border-border-tan">
            <Button
              size="sm"
              variant="outline"
              disabled={!!loading}
              onClick={() => handleAction("under_review")}
            >
              {loading === "under_review" ? "..." : "Mark Reviewing"}
            </Button>
            <Button
              size="sm"
              disabled={!!loading}
              onClick={() => handleAction("accepted")}
              className="bg-tertiary hover:bg-tertiary-container"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {loading === "accepted" ? "Approving..." : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={!!loading}
              onClick={() => handleAction("declined")}
              className="text-status-error hover:bg-error-container"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              {loading === "declined" ? "..." : "Decline"}
            </Button>
          </div>
        )}

        {application.status === "accepted" && (
          <div className="flex items-center gap-sm pt-md border-t border-border-tan text-tertiary">
            <span className="material-symbols-outlined material-symbols-filled">verified</span>
            <span className="font-body-sm text-body-sm font-medium">Approved — applicant notified</span>
          </div>
        )}
      </div>
    </div>
  );
}
