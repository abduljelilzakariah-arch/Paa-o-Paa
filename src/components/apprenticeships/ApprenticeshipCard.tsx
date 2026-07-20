import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Apprenticeship } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ApprenticeshipCard({ listing }: { listing: Apprenticeship }) {
  return (
    <Link href={`/apprenticeships/${listing.id}`} className="group block">
      <div className="bg-surface-white rounded-xl border border-border-tan p-lg shadow-card bento-card h-full flex flex-col">
        <div className="flex justify-between items-start mb-md">
          <Badge>{listing.trade}</Badge>
          <span className="font-label-caps text-label-caps text-on-surface-variant/60">
            {listing.duration}
          </span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-sm">
          {listing.title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
          {listing.posterName}
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant/80 line-clamp-2 flex-grow">
          {listing.description}
        </p>
        <div className="mt-lg pt-md border-t border-border-tan flex justify-between items-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {listing.town}, {listing.region}
          </span>
          <span className="font-label-caps text-label-caps text-primary">
            {listing.stipend}
          </span>
        </div>
        <p className="font-label-caps text-[11px] text-on-surface-variant/50 mt-sm">
          Apply by {formatDate(listing.deadline)}
        </p>
      </div>
    </Link>
  );
}
