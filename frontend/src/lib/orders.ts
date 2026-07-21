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
  agreedRate: number;
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
  agreedRate: number;
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
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

/* ————————————————————— public API ————————————————————— */

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (API_BASE) {
    try {
      const order = await apiFetch<Order>("/orders", {
        method: "POST",
        body: JSON.stringify(input),
      });
      rememberMine(order.id);
      if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
      return order;
    } catch {
      /* fall through to localStorage */
    }
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: genId(),
    orderNumber: genOrderNumber(),
    trackingNumber: genTrackingNumber(),
    ...input,
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
    try {
      const ids = myIds();
      if (ids.length === 0) return [];
      return await apiFetch<Order[]>(`/orders/mine?ids=${encodeURIComponent(ids.join(","))}`);
    } catch {
      /* fall through */
    }
  }
  return readStore();
}

/** All orders (admin view). Requires the backend + auth token when in API mode. */
export async function listAllOrders(token?: string): Promise<Order[]> {
  if (API_BASE && token) {
    try {
      return await apiFetch<Order[]>("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      /* fall through */
    }
  }
  return readStore();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  token?: string,
): Promise<void> {
  if (API_BASE && token) {
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
      return;
    } catch {
      /* fall through */
    }
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
  if (API_BASE && token) {
    try {
      await apiFetch(`/orders/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ agreedRate }),
      });
      if (typeof window !== "undefined") window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
      return;
    } catch {
      /* fall through */
    }
  }
  const orders = readStore().map((o) =>
    o.id === id ? { ...o, agreedRate, updatedAt: new Date().toISOString() } : o,
  );
  writeStore(orders);
}
