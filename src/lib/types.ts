export type UserRole = "user" | "artisan" | "business" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  name: string;
  region: string;
  town: string;
  profilePhoto?: string;
  verified: boolean;
}

export interface Artisan {
  id: string;
  userId?: string;
  name: string;
  businessName: string;
  trade: string;
  category: string;
  region: string;
  town: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearsExperience: number;
  phone: string;
  whatsapp: string;
  bio: string;
  portfolio: string[];
  profilePhoto: string;
  latitude: number;
  longitude: number;
}

export interface ArtisanWithDistance extends Artisan {
  distanceKm: number;
}

export interface ProfileView {
  id: string;
  artisanId: string;
  viewerId: string | null;
  viewedAt: string;
}

export interface ContactRequest {
  id: string;
  artisanId: string;
  userId: string | null;
  channel: "phone" | "whatsapp";
  createdAt: string;
}

export interface DashboardStats {
  profileViews: number;
  contactRequests: number;
  pendingApplications: number;
  totalApplications: number;
  activeListings: number;
  rating: number;
  reviewCount: number;
}

export interface SavedArtisan {
  userId: string;
  artisanId: string;
  savedAt: string;
}

export interface ContactWithArtisan extends ContactRequest {
  artisan?: Artisan;
}

export interface ReviewWithArtisan extends Review {
  artisan?: Artisan;
}

export type ArtisanSort = "distance" | "rating" | "reviews";

export interface Review {
  id: string;
  artisanId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  flagged: boolean;
}

export interface Apprenticeship {
  id: string;
  posterId: string;
  posterType: "artisan" | "business";
  posterName: string;
  title: string;
  trade: string;
  description: string;
  requirements: string;
  duration: string;
  schedule: string;
  stipend: string;
  region: string;
  town: string;
  deadline: string;
  status: "active" | "closed";
}

export interface Application {
  id: string;
  listingId: string;
  applicantId: string;
  applicantName: string;
  statement: string;
  status: "submitted" | "under_review" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithListing extends Application {
  listing?: Apprenticeship;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region: string;
  town: string;
  profilePhoto?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
