"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ApprenticeshipCard } from "@/components/apprenticeships/ApprenticeshipCard";
import { Input } from "@/components/ui/Input";
import type { Apprenticeship } from "@/lib/types";

function ApprenticeshipsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Apprenticeship[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/regions").then((r) => r.json()).then((d) => setRegions(d.regions));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (region) params.set("region", region);

    fetch(`/api/apprenticeships?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setListings(d.listings);
        setLoading(false);
      });
  }, [search, region]);

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <div className="mb-xl">
        <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-sm">
          Apprenticeships
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Discover vocational training opportunities across Ghana.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-md mb-xl">
        <div className="flex-grow">
          <Input
            placeholder="Search by title, trade, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-md py-3 rounded-lg border border-border-tan bg-surface-white focus:border-primary outline-none min-w-[180px]"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-xxl">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-md">school</span>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">No listings found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {listings.map((listing) => (
            <ApprenticeshipCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApprenticeshipsPage() {
  return (
    <Suspense>
      <ApprenticeshipsContent />
    </Suspense>
  );
}
