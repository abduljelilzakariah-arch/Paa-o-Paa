"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import type { ArtisanWithDistance, Review } from "@/lib/types";

type SavedArtisan = ArtisanWithDistance & { reviewSnippet?: Review | null; saved?: boolean };

export default function SavedArtisansPage() {
  const [saved, setSaved] = useState<SavedArtisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/saved")
      .then((r) => r.json())
      .then((d) => {
        const artisans = (d.saved ?? []).map((a: SavedArtisan) => ({
          ...a,
          distanceKm: Infinity,
          saved: true,
        }));
        setSaved(artisans);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="skeleton h-64 rounded-xl" />;
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">Saved Artisans</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">
        Artisans you&apos;ve bookmarked for later.
      </p>

      {saved.length === 0 ? (
        <div className="bg-surface-white border border-border-tan rounded-xl p-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-md">bookmark</span>
          <p className="font-body-lg text-on-surface-variant">No saved artisans yet.</p>
          <Link href="/artisans" className="text-primary font-body-sm mt-md inline-block hover:underline">
            Browse artisans
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {saved.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </div>
  );
}
