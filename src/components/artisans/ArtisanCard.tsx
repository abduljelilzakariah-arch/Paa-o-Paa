import Link from "next/link";
import Image from "next/image";
import { VerifiedBadge } from "@/components/ui/Badge";
import { SaveButton } from "@/components/artisans/SaveButton";
import { formatDistance } from "@/lib/geo";
import type { ArtisanWithDistance, Review } from "@/lib/types";

type ArtisanCardData = ArtisanWithDistance & {
  reviewSnippet?: Review | null;
  saved?: boolean;
};

export function ArtisanCard({ artisan }: { artisan: ArtisanCardData }) {
  const showDistance = Number.isFinite(artisan.distanceKm);

  return (
    <div className="relative group">
      <Link href={`/artisans/${artisan.id}`} className="block">
        <div className="bg-surface-white rounded-xl border border-border-tan overflow-hidden shadow-card bento-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={artisan.profilePhoto}
              alt={artisan.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:768px) 100vw, 33vw"
            />
            {artisan.verified && (
              <div className="absolute top-sm left-sm">
                <VerifiedBadge />
              </div>
            )}
            {showDistance && (
              <div className="absolute bottom-sm right-sm bg-inverse-surface/90 text-inverse-on-surface px-sm py-xs rounded-full font-label-caps text-[11px] flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">near_me</span>
                {formatDistance(artisan.distanceKm)}
              </div>
            )}
          </div>
          <div className="p-lg space-y-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  {artisan.businessName}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{artisan.trade}</p>
              </div>
              <div className="flex items-center gap-xs text-secondary">
                <span className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
                <span className="font-label-caps text-label-caps font-bold">{artisan.rating.toFixed(1)}</span>
                <span className="text-on-surface-variant/50 text-[11px]">({artisan.reviewCount})</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant/70">
              {artisan.town}, {artisan.region}
            </p>
            {artisan.reviewSnippet ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 italic">
                &ldquo;{artisan.reviewSnippet.comment}&rdquo;
                <span className="not-italic text-on-surface-variant/50"> — {artisan.reviewSnippet.userName}</span>
              </p>
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{artisan.bio}</p>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute top-sm right-sm z-10">
        <SaveButton artisanId={artisan.id} initialSaved={artisan.saved} size="sm" />
      </div>
    </div>
  );
}
