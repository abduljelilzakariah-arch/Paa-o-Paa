"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ReviewWithArtisan } from "@/lib/types";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/reviews")
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="skeleton h-64 rounded-xl" />;
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">My Reviews</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">
        Reviews you&apos;ve left for artisans you&apos;ve worked with.
      </p>

      {reviews.length === 0 ? (
        <div className="bg-surface-white border border-border-tan rounded-xl p-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-md">rate_review</span>
          <p className="font-body-lg text-on-surface-variant">No reviews yet.</p>
          <Link href="/artisans" className="text-primary font-body-sm mt-md inline-block hover:underline">
            Find an artisan to review
          </Link>
        </div>
      ) : (
        <div className="space-y-md">
          {reviews.map((review) => (
            <div key={review.id} className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card">
              <div className="flex flex-wrap justify-between gap-md mb-sm">
                <div>
                  <Link
                    href={`/artisans/${review.artisanId}`}
                    className="font-headline-sm text-headline-sm text-on-surface hover:text-primary"
                  >
                    {review.artisan?.businessName ?? "Artisan"}
                  </Link>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{review.artisan?.trade}</p>
                </div>
                <div className="flex items-center gap-xs text-secondary">
                  <span className="material-symbols-outlined material-symbols-filled text-[18px]">star</span>
                  <span className="font-headline-sm">{review.rating}</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{review.comment}</p>
              <p className="font-label-caps text-[11px] text-on-surface-variant/50 mt-sm">{formatDate(review.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
