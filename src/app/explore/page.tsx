"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ACCRA_CENTER } from "@/lib/geo";
import { formatDistance } from "@/lib/geo";
import { formatDate } from "@/lib/utils";
import type { ArtisanWithDistance, ReviewWithArtisan, ContactWithArtisan, SessionUser } from "@/lib/types";

interface CustomerDashboard {
  nearbyCount: number;
  nearbyArtisans: ArtisanWithDistance[];
  savedCount: number;
  savedArtisans: ArtisanWithDistance[];
  recentContacts: ContactWithArtisan[];
  reviewCount: number;
  recentReviews: ReviewWithArtisan[];
}

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(ACCRA_CENTER);

  const loadDashboard = useCallback((lat: number, lng: number) => {
    fetch(`/api/customer/dashboard?lat=${lat}&lng=${lng}`)
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((d) => {
        setDashboard(d.dashboard);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) {
          router.push("/login");
          return;
        }
        setUser(d.user);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          loadDashboard(loc.lat, loc.lng);
        },
        () => loadDashboard(ACCRA_CENTER.lat, ACCRA_CENTER.lng),
        { timeout: 8000 }
      );
    } else {
      loadDashboard(ACCRA_CENTER.lat, ACCRA_CENTER.lng);
    }
  }, [loadDashboard, router]);

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/artisans?${params}`);
  }

  if (loading || !dashboard) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
        <div className="skeleton h-48 rounded-xl mb-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <div className="mb-xl">
        <p className="font-label-caps text-label-caps text-primary uppercase mb-xs">Explore Hub</p>
        <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface mb-sm">
          Hello, {user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Find artisans near you, save favourites, and track your contacts — all in one place.
        </p>
      </div>

      <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-md mb-xl">
        <div className="flex-grow">
          <Input
            placeholder="Quick search — name, trade, or town..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        {[
          { label: "Near You (25 km)", value: dashboard.nearbyCount, icon: "near_me", href: "/artisans" },
          { label: "Saved", value: dashboard.savedCount, icon: "bookmark", href: "/profile/saved" },
          { label: "Contacts", value: dashboard.recentContacts.length, icon: "call_log", href: "/profile/contacts" },
          { label: "Reviews", value: dashboard.reviewCount, icon: "rate_review", href: "/profile/reviews" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card bento-card text-center"
          >
            <span className="material-symbols-outlined text-primary text-[28px] mb-sm">{stat.icon}</span>
            <p className="font-headline-md text-headline-md text-on-surface">{stat.value}</p>
            <p className="font-label-caps text-[11px] text-on-surface-variant uppercase">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-sm mb-xl">
        {[
          { label: "Near Me", href: "/artisans?chip=near" },
          { label: "Top Rated", href: "/artisans?chip=top&minRating=4.5&sort=rating" },
          { label: "Verified Only", href: "/artisans?chip=verified&verifiedOnly=true" },
        ].map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className="px-md py-sm rounded-full border border-border-tan bg-surface-white font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <section className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-sm text-headline-sm">Nearest Artisans</h2>
            <Link href="/artisans" className="text-primary font-body-sm text-body-sm hover:underline">
              View all
            </Link>
          </div>
          {dashboard.nearbyArtisans.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm">No artisans found nearby. Try expanding your search.</p>
          ) : (
            <div className="space-y-md">
              {dashboard.nearbyArtisans.map((artisan) => (
                <Link
                  key={artisan.id}
                  href={`/artisans/${artisan.id}`}
                  className="flex gap-md p-sm rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={artisan.profilePhoto} alt={artisan.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline-sm text-headline-sm truncate">{artisan.businessName}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{artisan.trade}</p>
                    <p className="font-label-caps text-[11px] text-primary">
                      {Number.isFinite(artisan.distanceKm) ? formatDistance(artisan.distanceKm) : artisan.town}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-sm text-headline-sm">Saved Artisans</h2>
            <Link href="/profile/saved" className="text-primary font-body-sm text-body-sm hover:underline">
              View all
            </Link>
          </div>
          {dashboard.savedArtisans.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm">
              No saved artisans yet. Tap the bookmark on any profile to save.
            </p>
          ) : (
            <div className="space-y-md">
              {dashboard.savedArtisans.map((artisan) => (
                <Link
                  key={artisan.id}
                  href={`/artisans/${artisan.id}`}
                  className="flex gap-md p-sm rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={artisan.profilePhoto} alt={artisan.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm">{artisan.businessName}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{artisan.trade}</p>
                    <p className="font-label-caps text-[11px] text-secondary flex items-center gap-xs">
                      <span className="material-symbols-outlined material-symbols-filled text-[14px]">star</span>
                      {artisan.rating.toFixed(1)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-sm text-headline-sm">Recent Contacts</h2>
            <Link href="/profile/contacts" className="text-primary font-body-sm text-body-sm hover:underline">
              View all
            </Link>
          </div>
          {dashboard.recentContacts.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm">You haven&apos;t contacted any artisans yet.</p>
          ) : (
            <div className="space-y-md">
              {dashboard.recentContacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center p-sm rounded-lg bg-surface-container-low">
                  <div>
                    <p className="font-headline-sm text-headline-sm">{contact.artisan?.businessName ?? "Artisan"}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant capitalize">{contact.channel}</p>
                  </div>
                  <p className="font-label-caps text-[11px] text-on-surface-variant">{formatDate(contact.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-sm text-headline-sm">Your Reviews</h2>
            <Link href="/profile/reviews" className="text-primary font-body-sm text-body-sm hover:underline">
              View all
            </Link>
          </div>
          {dashboard.recentReviews.length === 0 ? (
            <p className="text-on-surface-variant font-body-sm">Leave a review after contacting an artisan.</p>
          ) : (
            <div className="space-y-md">
              {dashboard.recentReviews.map((review) => (
                <div key={review.id} className="p-sm rounded-lg bg-surface-container-low">
                  <div className="flex justify-between mb-xs">
                    <p className="font-headline-sm text-headline-sm">{review.artisan?.businessName}</p>
                    <span className="text-secondary flex items-center gap-xs text-sm">
                      <span className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
                      {review.rating}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
