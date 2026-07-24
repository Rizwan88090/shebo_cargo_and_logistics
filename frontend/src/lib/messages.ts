/**
 * Contact-message data layer.
 *
 * Mirrors `lib/orders.ts`: when `NEXT_PUBLIC_API_URL` is configured it talks to
 * the live NestJS backend (messages persist to PostgreSQL and appear in the
 * admin panel in real time). With no API configured it falls back to browser
 * localStorage so the demo still works end-to-end.
 */

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateMessageInput {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

const LS_KEY = "shebo_messages";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const MESSAGES_UPDATED_EVENT = "shebo-messages-updated";

/* ————————————————————— localStorage fallback ————————————————————— */

function readStore(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

function writeStore(messages: Message[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
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

/** Send a contact message. In API mode it lands straight in the admin panel. */
export async function sendMessage(input: CreateMessageInput): Promise<Message> {
  if (API_BASE) {
    const message = await apiFetch<Message>("/messages", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
    return message;
  }

  const now = new Date().toISOString();
  const message: Message = {
    id: genId(),
    ...input,
    phone: input.phone ?? null,
    service: input.service ?? null,
    isRead: false,
    createdAt: now,
  };
  const messages = readStore();
  messages.unshift(message);
  writeStore(messages);
  return message;
}

/** All messages (admin view). Requires the backend + admin token in API mode. */
export async function listMessages(token?: string): Promise<Message[]> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to view messages.");
    return apiFetch<Message[]>("/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return readStore();
}

export async function markMessageRead(id: string, token?: string): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to update messages.");
    await apiFetch(`/messages/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
    return;
  }
  const messages = readStore().map((m) => (m.id === id ? { ...m, isRead: true } : m));
  writeStore(messages);
}

export async function deleteMessage(id: string, token?: string): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to delete messages.");
    await apiFetch(`/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
    return;
  }
  writeStore(readStore().filter((m) => m.id !== id));
}
