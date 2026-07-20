import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    accepted: "Accepted",
    declined: "Declined",
  };
  return labels[status] ?? status;
}

export function statusColor(status: string) {
  const colors: Record<string, string> = {
    submitted: "bg-surface-container text-on-surface-variant",
    under_review: "bg-secondary-container/30 text-on-secondary-container",
    accepted: "bg-tertiary-fixed text-on-tertiary-fixed",
    declined: "bg-error-container text-on-error-container",
  };
  return colors[status] ?? "bg-surface-container text-on-surface-variant";
}
