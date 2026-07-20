const BASE = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed");
  return json;
}

export const api = {
  login: (identifier: string, password: string) =>
    request<{ success: boolean; user: unknown }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    region?: string;
    town?: string;
  }) =>
    request<{ success: boolean; user: unknown }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  verifyOtp: (code: string) =>
    request<{ success: boolean }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  getProfile: () => request<{ user: unknown }>("/api/profile"),

  updateProfile: (data: Record<string, string>) =>
    request<{ user: unknown }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getArtisans: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ artisans: unknown[] }>(`/api/artisans${qs}`);
  },

  getArtisan: (id: string) =>
    request<{ artisan: unknown; reviews: unknown[] }>(`/api/artisans/${id}`),

  getApprenticeships: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ listings: unknown[] }>(`/api/apprenticeships${qs}`);
  },

  getApprenticeship: (id: string) =>
    request<{ listing: unknown }>(`/api/apprenticeships/${id}`),

  apply: (listingId: string, statement: string) =>
    request<{ application: unknown }>(`/api/apprenticeships/${listingId}/apply`, {
      method: "POST",
      body: JSON.stringify({ statement }),
    }),

  getApplications: () =>
    request<{ applications: unknown[] }>("/api/applications"),

  postReview: (artisanId: string, rating: number, comment: string) =>
    request<{ review: unknown }>(`/api/artisans/${artisanId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    }),

  getCategories: () => request<{ categories: unknown[] }>("/api/categories"),

  getRegions: () => request<{ regions: string[] }>("/api/regions"),
};
