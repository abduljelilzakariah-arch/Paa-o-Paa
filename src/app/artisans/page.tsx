"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ACCRA_CENTER } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { ArtisanSort, ArtisanWithDistance, Review } from "@/lib/types";

type ArtisanResult = ArtisanWithDistance & { reviewSnippet?: Review | null; saved?: boolean };

function ArtisansContent() {
  const searchParams = useSearchParams();
  const [artisans, setArtisans] = useState<ArtisanResult[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [radiusKm, setRadiusKm] = useState(50);
  const [minRating, setMinRating] = useState<number>(
    searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : 0
  );
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verifiedOnly") === "true");
  const [sort, setSort] = useState<ArtisanSort>(
    (searchParams.get("sort") as ArtisanSort) || "distance"
  );
  const [activeChip, setActiveChip] = useState<string | null>(searchParams.get("chip"));
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"loading" | "granted" | "denied" | "idle">("idle");
  const [loading, setLoading] = useState(true);

  const requestLocation = useCallback(() => {
    setLocStatus("loading");
    if (!navigator.geolocation) {
      setLocation(ACCRA_CENTER);
      setLocStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
      },
      () => {
        setLocation(ACCRA_CENTER);
        setLocStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    const params = new URLSearchParams({
      lat: String(location.lat),
      lng: String(location.lng),
      radius: String(radiusKm),
      sort,
    });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (minRating > 0) params.set("minRating", String(minRating));
    if (verifiedOnly) params.set("verifiedOnly", "true");

    fetch(`/api/artisans?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setArtisans(d.artisans);
        setLoading(false);
      });
  }, [search, category, location, radiusKm, minRating, verifiedOnly, sort]);

  function applyChip(chip: "near" | "top" | "verified") {
    setActiveChip(chip);
    if (chip === "near") {
      setSort("distance");
      setMinRating(0);
      setVerifiedOnly(false);
    } else if (chip === "top") {
      setSort("rating");
      setMinRating(4.5);
      setVerifiedOnly(false);
    } else if (chip === "verified") {
      setVerifiedOnly(true);
      setMinRating(0);
    }
  }

  const sortLabel =
    sort === "distance" ? "Nearest first" : sort === "rating" ? "Highest rated" : "Most reviewed";

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <div className="mb-xl">
        <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-sm">
          Artisans Near You
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Find verified artisans — filter by rating, distance, and reviews.
        </p>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-border-tan p-md mb-lg flex flex-wrap items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <span
            className={`material-symbols-outlined text-[28px] ${
              locStatus === "granted" ? "text-tertiary" : "text-primary"
            }`}
          >
            {locStatus === "loading" ? "progress_activity" : "my_location"}
          </span>
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">
              {locStatus === "loading" && "Finding your location..."}
              {locStatus === "granted" && "Showing artisans nearest to you"}
              {locStatus === "denied" && "Using Accra as default location"}
              {locStatus === "idle" && "Enable location to find nearby artisans"}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{sortLabel}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={requestLocation}>
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Update Location
        </Button>
      </div>

      <div className="flex flex-wrap gap-sm mb-lg">
        {(
          [
            { id: "near" as const, label: "Near Me", icon: "near_me" },
            { id: "top" as const, label: "Top Rated (4.5+)", icon: "star" },
            { id: "verified" as const, label: "Verified Only", icon: "verified" },
          ] as const
        ).map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => applyChip(chip.id)}
            className={cn(
              "inline-flex items-center gap-xs px-md py-sm rounded-full border font-label-caps text-label-caps transition-colors",
              activeChip === chip.id
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-white text-on-surface-variant border-border-tan hover:border-primary hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-md mb-xl">
        <div className="flex-grow">
          <Input
            placeholder="Search by name, trade, or town..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none min-w-[160px]"
        >
          <option value="">All Trades</option>
          {["plumbing", "electrical", "carpentry", "tailoring", "welding", "masonry"].map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none min-w-[140px]"
          aria-label="Minimum rating"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as ArtisanSort)}
          className="px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none min-w-[160px]"
          aria-label="Sort by"
        >
          <option value="distance">Nearest</option>
          <option value="rating">Highest rated</option>
          <option value="reviews">Most reviewed</option>
        </select>
        <select
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none min-w-[140px]"
          aria-label="Search radius"
        >
          <option value={10}>Within 10 km</option>
          <option value={25}>Within 25 km</option>
          <option value={50}>Within 50 km</option>
          <option value={100}>Within 100 km</option>
          <option value={500}>Within 500 km</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-80 rounded-xl" />
          ))}
        </div>
      ) : artisans.length === 0 ? (
        <div className="text-center py-xxl bg-surface-white rounded-xl border border-border-tan">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-md">
            location_off
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">
            No artisans match your filters
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-sm">
            Try adjusting filters or expanding the distance radius.
          </p>
          <Button
            variant="outline"
            className="mt-md"
            onClick={() => {
              setMinRating(0);
              setVerifiedOnly(false);
              setActiveChip(null);
              setRadiusKm(500);
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-md">
            {artisans.length} artisan{artisans.length !== 1 ? "s" : ""} found — {sortLabel.toLowerCase()}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense>
      <ArtisansContent />
    </Suspense>
  );
}
