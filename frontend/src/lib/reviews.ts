/**
 * Customer-review data layer.
 *
 * Mirrors `lib/messages.ts`: with `NEXT_PUBLIC_API_URL` set it talks to the live
 * NestJS backend (reviews persist to PostgreSQL and show on the site in real
 * time). With no API configured it falls back to browser localStorage so the
 * demo still works end-to-end.
 */

export interface ReviewEntry {
  id: string;
  name: string;
  company?: string | null;
  rating: number;
  text: string;
  service?: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewInput {
  name: string;
  company?: string;
  rating: number;
  text: string;
  service?: string;
}

const LS_KEY = "shebo_reviews";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const REVIEWS_UPDATED_EVENT = "shebo-reviews-updated";

/* ————————————————————— localStorage fallback ————————————————————— */

function readStore(): ReviewEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ReviewEntry[]) : [];
  } catch {
    return [];
  }
}

function writeStore(reviews: ReviewEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/* ————————————————————— shared fetch helper ————————————————————— */

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } catch {
      /* ignore body parse errors */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ————————————————————— public API ————————————————————— */

/** Submit a customer review. Shows on the site immediately (real time). */
export async function submitReview(input: CreateReviewInput): Promise<ReviewEntry> {
  if (API_BASE) {
    const review = await apiFetch<ReviewEntry>("/reviews", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
    return review;
  }

  const now = new Date().toISOString();
  const review: ReviewEntry = {
    id: genId(),
    ...input,
    company: input.company ?? null,
    service: input.service ?? null,
    isApproved: true,
    createdAt: now,
  };
  const reviews = readStore();
  reviews.unshift(review);
  writeStore(reviews);
  return review;
}

/** Approved reviews for the public website. No auth required. */
export async function listPublicReviews(): Promise<ReviewEntry[]> {
  if (API_BASE) {
    try {
      return await apiFetch<ReviewEntry[]>("/reviews");
    } catch {
      return [];
    }
  }
  return readStore().filter((r) => r.isApproved);
}

/** All reviews incl. hidden (admin view). Requires admin token in API mode. */
export async function listAllReviews(token?: string): Promise<ReviewEntry[]> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to view reviews.");
    return apiFetch<ReviewEntry[]>("/reviews/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return readStore();
}

export async function setReviewApproved(id: string, isApproved: boolean, token?: string): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to update reviews.");
    await apiFetch(`/reviews/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isApproved }),
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
    return;
  }
  writeStore(readStore().map((r) => (r.id === id ? { ...r, isApproved } : r)));
}

export async function deleteReview(id: string, token?: string): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to delete reviews.");
    await apiFetch(`/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
    return;
  }
  writeStore(readStore().filter((r) => r.id !== id));
}
