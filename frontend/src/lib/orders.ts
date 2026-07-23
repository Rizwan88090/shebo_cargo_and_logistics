/**
 * Order data layer for the public "Order" flow.
 *
 * Works out of the box against browser localStorage (the same architecture the
 * rest of this app currently uses). If `NEXT_PUBLIC_API_URL` is configured and
 * the Meridian backend Orders API is running, it transparently uses that
 * instead, falling back to localStorage if the API is unreachable so the UI
 * never hard-fails.
 */

export type OrderStatus =
  | "pending"
  | "processing"
  | "in_transit"
  | "customs"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  fullName: string;
  phone: string;
  fromCity: string;
  toCity: string;
  cargoType: string;
  agreedRate: number | null;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  fullName: string;
  phone: string;
  fromCity: string;
  toCity: string;
  cargoType: string;
  notes?: string;
}

const LS_KEY = "meridian_orders";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const ORDERS_UPDATED_EVENT = "meridian-orders-updated";

/* ————————————————————— localStorage helpers ————————————————————— */

function readStore(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeStore(orders: Order[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(orders));
  // Notify listeners in the same tab (the native `storage` event only fires cross-tab).
  window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function genOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${rand}`;
}

function genTrackingNumber(): string {
  const rand = Math.floor(10_000_000 + Math.random() * 89_999_999);
  return `MRD-AE-${rand}`;
}

/* ————————————————————— API helpers ————————————————————— */

const MINE_KEY = "meridian_my_order_ids";

function rememberMine(id: string) {
  if (typeof window === "undefined") return;
  try {
    const ids = JSON.parse(window.localStorage.getItem(MINE_KEY) || "[]") as string[];
    if (!ids.includes(id)) {
      ids.push(id);
      window.localStorage.setItem(MINE_KEY, JSON.stringify(ids));
    }
  } catch {
    window.localStorage.setItem(MINE_KEY, JSON.stringify([id]));
  }
}

function myIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(MINE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      // Headers MUST come after ...init — otherwise init's own `headers`
      // (e.g. Authorization on admin PATCH calls) would override this object
      // and drop Content-Type, so the JSON body never gets parsed on the server.
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
      /* ignore body parse errors, use fallback message */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ————————————————————— public API ————————————————————— */

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (API_BASE) {
    // Real backend mode: don't silently fall back to the disconnected localStorage
    // demo store — a "successful" order that never reaches the database would
    // never show up in the admin panel, which is worse than a visible error.
    const order = await apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
    rememberMine(order.id);
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
    return order;
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: genId(),
    orderNumber: genOrderNumber(),
    trackingNumber: genTrackingNumber(),
    ...input,
    agreedRate: null,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  const orders = readStore();
  orders.unshift(order);
  writeStore(orders);
  rememberMine(order.id);
  return order;
}

/** Orders placed from this browser (the public "My orders" list). */
export async function listMyOrders(): Promise<Order[]> {
  if (API_BASE) {
    const ids = myIds();
    if (ids.length === 0) return [];
    try {
      return await apiFetch<Order[]>(`/orders/mine?ids=${encodeURIComponent(ids.join(","))}`);
    } catch {
      // Read-only widget: fail quiet (empty list) rather than showing stale,
      // disconnected localStorage data alongside real backend orders.
      return [];
    }
  }
  return readStore();
}

/**
 * All orders (admin view). Requires the backend + auth token when in API mode.
 *
 * Note: once `NEXT_PUBLIC_API_URL` is configured, admin reads/writes talk to the
 * real database exclusively — they do NOT silently fall back to the disconnected
 * localStorage demo store on failure. A silent fallback here previously made
 * Accept/Reject *look* like they worked (toast said "success") while nothing
 * actually changed in the database, because the write landed in a different
 * dataset than the one being displayed. Errors now propagate so the UI can
 * show what really happened.
 */
export async function listAllOrders(token?: string): Promise<Order[]> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to view orders.");
    return apiFetch<Order[]>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return readStore();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  token?: string,
): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to update orders.");
    await apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
    return;
  }
  const orders = readStore().map((o) =>
    o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o,
  );
  writeStore(orders);
}

export async function updateOrderRate(
  id: string,
  agreedRate: number,
  token?: string,
): Promise<void> {
  if (API_BASE) {
    if (!token) throw new Error("You must be signed in as an admin to update orders.");
    await apiFetch(`/orders/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ agreedRate }),
    });
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
    return;
  }
  const orders = readStore().map((o) =>
    o.id === id ? { ...o, agreedRate, updatedAt: new Date().toISOString() } : o,
  );
  writeStore(orders);
}

/** Look up a single order by tracking number or order number (public tracking page). */
export async function trackOrder(query: string): Promise<Order | null> {
  const q = query.trim();
  if (!q) return null;
  if (API_BASE) {
    try {
      return await apiFetch<Order>(`/orders/track/${encodeURIComponent(q)}`);
    } catch {
      return null;
    }
  }
  const upper = q.toUpperCase();
  return (
    readStore().find(
      (o) => o.trackingNumber.toUpperCase() === upper || o.orderNumber.toUpperCase() === upper,
    ) ?? null
  );
}

export interface TimelineStep {
  step: string;
  date?: string;
  completed: boolean;
}

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "in_transit", label: "In Transit" },
  { key: "customs", label: "Customs Clearance" },
  { key: "delivered", label: "Delivered" },
];

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** Derives a shipment progress timeline from an order's current status. */
export function buildOrderTimeline(order: Order): TimelineStep[] {
  if (order.status === "cancelled") {
    return [
      { step: "Order Placed", date: fmtDate(order.createdAt), completed: true },
      { step: "Cancelled", date: fmtDate(order.updatedAt), completed: true },
    ];
  }
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  return STATUS_STEPS.map((s, i) => ({
    step: s.label,
    date: i === 0 ? fmtDate(order.createdAt) : i <= currentIndex ? fmtDate(order.updatedAt) : undefined,
    completed: i <= currentIndex,
  }));
}
