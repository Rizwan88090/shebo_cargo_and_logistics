/**
 * Auth helpers for the Meridian portal/admin.
 * Talks to the NestJS backend (NEXT_PUBLIC_API_URL) and stores the JWT under
 * `meridian_token` — the same key lib/orders.ts uses for admin requests.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "meridian_token";
const USER_KEY = "meridian_user";

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const u = getUser();
  return u?.role === "ADMIN" || u?.role === "SUPER_ADMIN";
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    const msg = data?.message;
    return Array.isArray(msg) ? msg.join(", ") : msg || fallback;
  } catch {
    return fallback;
  }
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  if (!API_BASE) throw new Error("Backend URL is not configured (NEXT_PUBLIC_API_URL).");
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Invalid email or password."));
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    if (data.refreshToken) localStorage.setItem("meridian_refresh", data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  return data.user as AuthUser;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("meridian_refresh");
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!API_BASE) throw new Error("Backend URL is not configured (NEXT_PUBLIC_API_URL).");
  const token = getToken();
  if (!token) throw new Error("You must be signed in to change your password.");
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Could not change password."));
}
