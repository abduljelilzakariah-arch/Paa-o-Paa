"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SaveButton } from "@/components/artisans/SaveButton";
import { formatDate } from "@/lib/utils";
import type { Artisan, Review, SessionUser } from "@/lib/types";

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const reviewFormRef = useRef<HTMLFormElement>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  useEffect(() => {
    fetch(`/api/artisans/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setArtisan(d.artisan);
        setReviews(d.reviews);
        setSaved(d.saved ?? false);
        setUserReview(d.userReview ?? null);
        setLoading(false);
      });
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUser(d.user));
    fetch(`/api/artisans/${id}/views`, { method: "POST" });
  }, [id]);

  async function handleContact(channel: "phone" | "whatsapp") {
    const res = await fetch(`/api/artisans/${id}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel }),
    });
    const data = await res.json();
    if (data.contact?.type === "phone") {
      window.location.href = `tel:${data.contact.value}`;
    } else if (data.contact?.type === "whatsapp") {
      window.open(`https://wa.me/${data.contact.value.replace(/\D/g, "")}`, "_blank");
    }
    if (!userReview) {
      setShowReviewPrompt(true);
    }
  }

  function scrollToReview() {
    setShowReviewPrompt(false);
    reviewFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/artisans/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.review, ...prev]);
        setUserReview(data.review);
        setComment("");
        setShowReviewPrompt(false);
        const refresh = await fetch(`/api/artisans/${id}`).then((r) => r.json());
        setArtisan(refresh.artisan);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
        <div className="skeleton h-96 rounded-xl mb-xl" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="text-center py-xxl">
        <h1 className="font-headline-lg text-headline-lg">Artisan not found</h1>
        <Link href="/artisans" className="text-primary mt-md inline-block">Back to browse</Link>
      </div>
    );
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-container-max mx-auto">
      <Link href="/artisans" className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary mb-lg font-body-sm">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to artisans
      </Link>

      {showReviewPrompt && (
        <div className="mb-lg bg-secondary-container border border-secondary/20 rounded-xl p-lg flex flex-wrap items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-secondary text-[32px]">rate_review</span>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface">Got help from {artisan.businessName}?</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Share your experience to help others.</p>
            </div>
          </div>
          <div className="flex gap-sm">
            <Button variant="outline" size="sm" onClick={() => setShowReviewPrompt(false)}>
              Later
            </Button>
            <Button size="sm" onClick={scrollToReview}>
              Leave a Review
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 space-y-xl">
          <div className="bg-surface-white rounded-xl border border-border-tan overflow-hidden shadow-card">
            <div className="relative h-64 md:h-80">
              <Image src={artisan.profilePhoto} alt={artisan.name} fill className="object-cover" sizes="66vw" priority />
              <div className="absolute top-md right-md">
                <SaveButton artisanId={artisan.id} initialSaved={saved} />
              </div>
            </div>
            <div className="p-xl">
              <div className="flex flex-wrap items-start justify-between gap-md mb-md">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">{artisan.businessName}</h1>
                  <p className="font-body-lg text-body-lg text-primary">{artisan.trade}</p>
                </div>
                {artisan.verified && <VerifiedBadge />}
              </div>
              <div className="flex flex-wrap gap-lg mb-lg text-on-surface-variant font-body-sm">
                <span className="flex items-center gap-xs">
                  <span className="material-symbols-outlined material-symbols-filled text-secondary text-[18px]">star</span>
                  {artisan.rating.toFixed(1)} ({artisan.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {artisan.town}, {artisan.region}
                </span>
                <span className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">work_history</span>
                  {artisan.yearsExperience} years experience
                </span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{artisan.bio}</p>
            </div>
          </div>

          {artisan.portfolio.length > 0 && (
            <div>
              <h2 className="font-headline-md text-headline-md mb-md">Portfolio</h2>
              <div className="grid grid-cols-2 gap-md">
                {artisan.portfolio.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={img} alt={`Portfolio ${i + 1}`} fill className="object-cover" sizes="33vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-headline-md text-headline-md mb-md">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-on-surface-variant font-body-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-md">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-surface-white p-lg rounded-xl border border-border-tan">
                    <div className="flex justify-between mb-sm">
                      <span className="font-headline-sm text-headline-sm">{review.userName}</span>
                      <div className="flex items-center gap-xs text-secondary">
                        <span className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
                        {review.rating}
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{review.comment}</p>
                    <p className="font-label-caps text-[11px] text-on-surface-variant/50 mt-sm">{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-lg">
          <div className="bg-surface-white p-xl rounded-xl border border-border-tan shadow-card sticky top-24">
            <h3 className="font-headline-sm text-headline-sm mb-md">Request Contact</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
              Tap to view contact details — the artisan will see your request.
            </p>
            <div className="space-y-sm mb-lg">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleContact("phone")}
              >
                <span className="material-symbols-outlined">call</span>
                Call Artisan
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleContact("whatsapp")}
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp
              </Button>
            </div>

            {userReview ? (
              <div className="border-t border-border-tan pt-lg">
                <h3 className="font-headline-sm text-headline-sm mb-sm">Your Review</h3>
                <div className="flex items-center gap-xs text-secondary mb-sm">
                  <span className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
                  {userReview.rating}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{userReview.comment}</p>
              </div>
            ) : (
              <form ref={reviewFormRef} onSubmit={submitReview} className="border-t border-border-tan pt-lg space-y-md">
                <h3 className="font-headline-sm text-headline-sm">Leave a Review</h3>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs block">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-md py-2 rounded-lg border border-border-tan bg-surface-white outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} stars</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Comment"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {user ? (submitting ? "Submitting..." : "Submit Review") : "Sign in to Review"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
