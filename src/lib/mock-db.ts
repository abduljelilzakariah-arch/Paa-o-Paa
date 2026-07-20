import usersData from "@/data/users.json";
import artisansData from "@/data/artisans.json";
import apprenticeshipsData from "@/data/apprenticeships.json";
import applicationsData from "@/data/applications.json";
import reviewsData from "@/data/reviews.json";
import profileViewsData from "@/data/profile-views.json";
import contactRequestsData from "@/data/contact-requests.json";
import categoriesData from "@/data/categories.json";
import savedArtisansData from "@/data/saved-artisans.json";
import { haversineKm } from "@/lib/geo";
import type {
  User,
  Artisan,
  ArtisanWithDistance,
  Apprenticeship,
  Application,
  ApplicationWithListing,
  Review,
  Category,
  ProfileView,
  ContactRequest,
  DashboardStats,
  SessionUser,
  SavedArtisan,
  ContactWithArtisan,
  ReviewWithArtisan,
  ArtisanSort,
} from "@/lib/types";
import regionsData from "@/data/regions.json";

let users: User[] = [...usersData] as User[];
let artisans: Artisan[] = [...artisansData] as Artisan[];
let apprenticeships: Apprenticeship[] = [...apprenticeshipsData] as Apprenticeship[];
let applications: Application[] = [...applicationsData] as Application[];
let reviews: Review[] = [...reviewsData] as Review[];
let profileViews: ProfileView[] = [...profileViewsData] as ProfileView[];
let contactRequests: ContactRequest[] = [...contactRequestsData] as ContactRequest[];
let savedArtisans: SavedArtisan[] = [...savedArtisansData] as SavedArtisan[];

export function getUsers() {
  return users;
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function getUserByEmailOrPhone(identifier: string) {
  const normalized = identifier.toLowerCase().trim();
  return users.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.phone.replace(/\s/g, "") === normalized.replace(/\s/g, "")
  );
}

export function createUser(user: Omit<User, "id">) {
  const newUser: User = { ...user, id: `usr-${Date.now()}` };
  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function getArtisanByUserId(userId: string) {
  return artisans.find((a) => a.userId === userId);
}

export function getPosterIds(session: SessionUser): string[] {
  const ids = [session.id];
  if (session.role === "artisan") {
    const artisan = getArtisanByUserId(session.id);
    if (artisan) ids.push(artisan.id);
  }
  return ids;
}

export function getListingsByPoster(session: SessionUser) {
  const posterIds = getPosterIds(session);
  return apprenticeships.filter((l) => posterIds.includes(l.posterId));
}

export function getArtisans(filters?: {
  search?: string;
  category?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  sort?: ArtisanSort;
}): ArtisanWithDistance[] {
  let result = [...artisans];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.businessName.toLowerCase().includes(q) ||
        a.trade.toLowerCase().includes(q) ||
        a.town.toLowerCase().includes(q)
    );
  }

  if (filters?.category) {
    result = result.filter((a) => a.category === filters.category);
  }

  if (filters?.minRating != null && filters.minRating > 0) {
    result = result.filter((a) => a.rating >= filters.minRating!);
  }

  if (filters?.verifiedOnly) {
    result = result.filter((a) => a.verified);
  }

  const withDistance: ArtisanWithDistance[] = result.map((a) => ({
    ...a,
    distanceKm:
      filters?.lat != null && filters?.lng != null
        ? haversineKm(filters.lat, filters.lng, a.latitude, a.longitude)
        : Infinity,
  }));

  let filtered = withDistance;
  if (filters?.lat != null && filters?.lng != null) {
    const radius = filters.radiusKm ?? 100;
    filtered = withDistance.filter((a) => a.distanceKm <= radius);
  }

  const sort = filters?.sort ?? (filters?.lat != null ? "distance" : "rating");
  if (sort === "distance") {
    return filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  }
  if (sort === "reviews") {
    return filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return filtered.sort((a, b) => b.rating - a.rating);
}

export function getArtisanById(id: string) {
  return artisans.find((a) => a.id === id);
}

export function recordProfileView(artisanId: string, viewerId?: string | null) {
  const view: ProfileView = {
    id: `pv-${Date.now()}`,
    artisanId,
    viewerId: viewerId ?? null,
    viewedAt: new Date().toISOString(),
  };
  profileViews.push(view);
  return view;
}

export function getProfileViewsByArtisan(artisanId: string) {
  return profileViews.filter((v) => v.artisanId === artisanId);
}

export function recordContactRequest(
  artisanId: string,
  channel: "phone" | "whatsapp",
  userId?: string | null
) {
  const req: ContactRequest = {
    id: `cr-${Date.now()}`,
    artisanId,
    userId: userId ?? null,
    channel,
    createdAt: new Date().toISOString(),
  };
  contactRequests.push(req);
  return req;
}

export function getContactRequestsByArtisan(artisanId: string) {
  return contactRequests.filter((c) => c.artisanId === artisanId);
}

export function getContactRequestsByUser(userId: string): ContactWithArtisan[] {
  return contactRequests
    .filter((c) => c.userId === userId)
    .map((c) => ({ ...c, artisan: getArtisanById(c.artisanId) }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewsByUser(userId: string): ReviewWithArtisan[] {
  return reviews
    .filter((r) => r.userId === userId)
    .map((r) => ({ ...r, artisan: getArtisanById(r.artisanId) }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSavedArtisans(userId: string): Artisan[] {
  return savedArtisans
    .filter((s) => s.userId === userId)
    .map((s) => getArtisanById(s.artisanId))
    .filter((a): a is Artisan => !!a);
}

export function isArtisanSaved(userId: string, artisanId: string) {
  return savedArtisans.some((s) => s.userId === userId && s.artisanId === artisanId);
}

export function toggleSavedArtisan(userId: string, artisanId: string) {
  const index = savedArtisans.findIndex(
    (s) => s.userId === userId && s.artisanId === artisanId
  );
  if (index >= 0) {
    savedArtisans.splice(index, 1);
    return { saved: false };
  }
  savedArtisans.push({
    userId,
    artisanId,
    savedAt: new Date().toISOString(),
  });
  return { saved: true };
}

export function getTopReviewSnippet(artisanId: string) {
  const artisanReviews = getReviewsByArtisan(artisanId);
  if (artisanReviews.length === 0) return null;
  return artisanReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
}

export function getCustomerDashboard(userId: string, lat?: number, lng?: number) {
  const nearbyArtisans =
    lat != null && lng != null
      ? getArtisans({ lat, lng, radiusKm: 25, sort: "distance" })
      : getArtisans({ sort: "rating" });
  const saved = getSavedArtisans(userId);
  const contacts = getContactRequestsByUser(userId);
  const userReviews = getReviewsByUser(userId);

  return {
    nearbyCount: nearbyArtisans.length,
    nearbyArtisans: nearbyArtisans.slice(0, 3),
    savedCount: saved.length,
    savedArtisans: saved.slice(0, 3),
    recentContacts: contacts.slice(0, 3),
    reviewCount: userReviews.length,
    recentReviews: userReviews.slice(0, 2),
  };
}

export function getApprenticeships(filters?: {
  search?: string;
  region?: string;
  trade?: string;
}) {
  let result = apprenticeships.filter((a) => a.status === "active");

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.trade.toLowerCase().includes(q) ||
        a.posterName.toLowerCase().includes(q)
    );
  }

  if (filters?.region) {
    result = result.filter((a) => a.region === filters.region);
  }

  if (filters?.trade) {
    result = result.filter((a) => a.trade.toLowerCase() === filters.trade!.toLowerCase());
  }

  return result;
}

export function getApprenticeshipById(id: string) {
  return apprenticeships.find((a) => a.id === id);
}

export function getApplicationsByUser(userId: string) {
  return applications.filter((a) => a.applicantId === userId);
}

export function getApplicationsByPoster(session: SessionUser): ApplicationWithListing[] {
  const posterIds = getPosterIds(session);
  const listingIds = apprenticeships
    .filter((l) => posterIds.includes(l.posterId))
    .map((l) => l.id);

  return applications
    .filter((a) => listingIds.includes(a.listingId))
    .map((app) => ({
      ...app,
      listing: getApprenticeshipById(app.listingId),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getApplicationById(id: string) {
  return applications.find((a) => a.id === id);
}

export function updateApplicationStatus(
  id: string,
  status: Application["status"],
  session: SessionUser
) {
  const app = applications.find((a) => a.id === id);
  if (!app) return null;

  const listing = getApprenticeshipById(app.listingId);
  if (!listing) return null;

  const posterIds = getPosterIds(session);
  if (!posterIds.includes(listing.posterId)) return null;

  app.status = status;
  app.updatedAt = new Date().toISOString();
  return { ...app, listing };
}

export function createApplication(app: Omit<Application, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  applications.push(newApp);
  return newApp;
}

export function getDashboardStats(session: SessionUser): DashboardStats {
  const listings = getListingsByPoster(session);
  const listingIds = listings.map((l) => l.id);
  const posterApps = applications.filter((a) => listingIds.includes(a.listingId));

  let profileViewsCount = 0;
  let contactRequestsCount = 0;
  let rating = 0;
  let reviewCount = 0;

  if (session.role === "artisan") {
    const artisan = getArtisanByUserId(session.id);
    if (artisan) {
      profileViewsCount = getProfileViewsByArtisan(artisan.id).length;
      contactRequestsCount = getContactRequestsByArtisan(artisan.id).length;
      rating = artisan.rating;
      reviewCount = artisan.reviewCount;
    }
  }

  return {
    profileViews: profileViewsCount,
    contactRequests: contactRequestsCount,
    pendingApplications: posterApps.filter(
      (a) => a.status === "submitted" || a.status === "under_review"
    ).length,
    totalApplications: posterApps.length,
    activeListings: listings.filter((l) => l.status === "active").length,
    rating,
    reviewCount,
  };
}

export function getReviewsByArtisan(artisanId: string) {
  return reviews.filter((r) => r.artisanId === artisanId);
}

export function createReview(review: Omit<Review, "id" | "createdAt" | "flagged">) {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    flagged: false,
  };
  reviews.push(newReview);

  const artisan = artisans.find((a) => a.id === review.artisanId);
  if (artisan) {
    const artisanReviews = getReviewsByArtisan(review.artisanId);
    artisan.reviewCount = artisanReviews.length;
    artisan.rating =
      artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length;
  }

  return newReview;
}

export function getCategories() {
  return categoriesData as Category[];
}

export function getRegions() {
  return regionsData as string[];
}

export function toSessionUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    region: user.region,
    town: user.town,
    profilePhoto: user.profilePhoto,
  };
}
