"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MdSearch,
  MdCheck,
  MdClose,
  MdEdit,
  MdVisibility,
  MdSave,
} from "react-icons/md";
import {
  listAllOrders,
  updateOrderStatus,
  updateOrderRate,
  ORDERS_UPDATED_EVENT,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { useToast } from "@/components/ui/NotificationToast";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FILTERS = [
  "all",
  "pending",
  "processing",
  "in_transit",
  "customs",
  "delivered",
  "cancelled",
] as const;

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("meridian_token") ?? undefined;
}

export default function AdminOrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");

  const load = useCallback(() => {
    listAllOrders(getToken())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener(ORDERS_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [load]);

  const filteredOrders = orders.filter((o) => {
    const searchString =
      `${o.orderNumber} ${o.trackingNumber} ${o.fullName} ${o.fromCity} ${o.toCity} ${o.cargoType}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = async (o: Order) => {
    const next: OrderStatus = o.status === "pending" ? "processing" : "in_transit";
    await updateOrderStatus(o.id, next, getToken());
    addToast("success", "Order accepted", `Order ${o.orderNumber} set to ${label(next)}.`);
    load();
  };

  const handleReject = async (o: Order) => {
    await updateOrderStatus(o.id, "cancelled", getToken());
    addToast("error", "Order rejected", `Order ${o.orderNumber} has been cancelled.`);
    load();
  };

  const handleStatusChange = async (o: Order, newStatus: OrderStatus) => {
    await updateOrderStatus(o.id, newStatus, getToken());
    addToast("info", "Status updated", `Order ${o.orderNumber} set to ${label(newStatus)}.`);
    setEditingOrderId(null);
    load();
  };

  const handleSavePrice = async (o: Order) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      addToast("error", "Invalid rate", "Please enter a valid amount.");
      return;
    }
    await updateOrderRate(o.id, newPrice, getToken());
    addToast("success", "Rate saved", `Order ${o.orderNumber} rate set to AED ${newPrice.toLocaleString()}.`);
    setEditingPriceId(null);
    load();
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <div className="portal-page__header" style={{ marginBottom: "2rem" }}>
        <h1 className="portal-page__title" style={{ fontSize: "2rem", fontWeight: 900 }}>
          Order Management
        </h1>
        <p className="portal-page__subtitle" style={{ color: "var(--color-gray-500)" }}>
          Approve, reject, re-price, and update the status of incoming cargo orders.
        </p>
      </div>

      <div
        className="panel"
        style={{
          background: "var(--color-white)",
          borderRadius: "1rem",
          border: "1px solid var(--color-gray-100)",
          boxShadow: "var(--shadow-md)",
          padding: "1.5rem",
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1", minWidth: "280px" }}>
              <MdSearch
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-gray-400)",
                  fontSize: "1.25rem",
                }}
              />
              <input
                type="text"
                placeholder="Search by order #, client, route, cargo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.75rem",
                  border: "2px solid var(--color-gray-200)",
                  borderRadius: "0.5rem",
                  outline: "none",
                  fontSize: "0.9rem",
                }}
                className="search-input-field"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginLeft: "auto", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(212,168,83,0.1)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--color-gold-700)",
                  fontWeight: 700,
                }}
              >
                Pending: {orders.filter((o) => o.status === "pending").length}
              </div>
              <div
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--color-success)",
                  fontWeight: 700,
                }}
              >
                Active: {orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
            {STATUS_FILTERS.map((f) => {
              const count = f === "all" ? orders.length : orders.filter((o) => o.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    border: "1px solid transparent",
                    background: statusFilter === f ? "var(--color-navy-800)" : "var(--color-gray-50)",
                    color: statusFilter === f ? "var(--color-white)" : "var(--color-gray-600)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {label(f)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="data-table-wrapper" style={{ overflowX: "auto" }}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-navy-800)" }}>
                No orders found
              </h3>
              <p style={{ color: "var(--color-gray-400)" }}>
                New orders placed on the Order page will appear here.
              </p>
            </div>
          ) : (
            <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid var(--color-gray-100)" }}>
                  {["Order #", "Client", "Route / Cargo", "Rate", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "1rem 0.75rem",
                        fontSize: "0.85rem",
                        color: "var(--color-gray-500)",
                        fontWeight: 700,
                        textAlign: i === 5 ? "right" : "left",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    style={{ borderBottom: "1px solid var(--color-gray-100)" }}
                    className="admin-table-row"
                  >
                    <td style={{ padding: "1rem 0.75rem", fontWeight: 700, color: "var(--color-navy-800)" }}>
                      {o.orderNumber}
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ fontWeight: 600 }}>{o.fullName}</div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-gray-400)" }}>{o.phone}</span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {o.fromCity} → {o.toCity}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-gold-600)", fontWeight: 600 }}>
                        {o.cargoType}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      {editingPriceId === o.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            style={{
                              width: "90px",
                              padding: "0.25rem 0.4rem",
                              borderRadius: "0.25rem",
                              border: "1px solid var(--color-gold-500)",
                              fontSize: "0.8rem",
                              outline: "none",
                              fontWeight: 700,
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(o)}
                            style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "inline-flex", padding: "0.25rem" }}
                            title="Save rate"
                          >
                            <MdSave size={16} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <span style={{ fontWeight: 700, color: "var(--color-navy-900)" }}>
                            AED {o.agreedRate.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(o.id);
                              setTempPrice(o.agreedRate.toString());
                            }}
                            style={{ background: "none", border: "none", color: "var(--color-gray-400)", cursor: "pointer", display: "inline-flex", padding: "0.25rem" }}
                            title="Edit rate"
                          >
                            <MdEdit size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      {editingOrderId === o.id ? (
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            border: "1px solid var(--color-gold-500)",
                            fontSize: "0.8rem",
                            outline: "none",
                            background: "var(--color-white)",
                            fontWeight: 600,
                          }}
                          autoFocus
                          onBlur={() => setEditingOrderId(null)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in_transit">In Transit</option>
                          <option value="customs">At Customs</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <span className={`status-badge status-badge--${o.status}`} style={{ fontWeight: 700 }}>
                            {label(o.status)}
                          </span>
                          <button
                            onClick={() => setEditingOrderId(o.id)}
                            style={{ background: "none", border: "none", color: "var(--color-gray-400)", cursor: "pointer", display: "inline-flex", padding: "0.25rem" }}
                            title="Edit status"
                          >
                            <MdEdit size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end", alignItems: "center" }}>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          style={{ padding: "0.4rem", borderRadius: "0.25rem", background: "var(--color-gray-100)", border: "none", color: "var(--color-navy-800)", cursor: "pointer", display: "inline-flex" }}
                          title="View details"
                        >
                          <MdVisibility size={16} />
                        </button>
                        {(o.status === "pending" || o.status === "processing") && (
                          <button
                            onClick={() => handleAccept(o)}
                            style={{ padding: "0.4rem 0.6rem", borderRadius: "0.25rem", background: "linear-gradient(135deg, var(--color-success) 0%, #059669 100%)", border: "none", color: "var(--color-white)", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px" }}
                            title="Accept"
                          >
                            <MdCheck size={14} /> Accept
                          </button>
                        )}
                        {o.status !== "cancelled" && o.status !== "delivered" && (
                          <button
                            onClick={() => handleReject(o)}
                            style={{ padding: "0.4rem 0.6rem", borderRadius: "0.25rem", background: "linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)", border: "none", color: "var(--color-white)", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px" }}
                            title="Reject / cancel"
                          >
                            <MdClose size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "var(--color-white)",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "600px",
                padding: "2rem",
                boxShadow: "var(--shadow-2xl)",
                border: "1px solid var(--color-gold-300)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-gray-100)", paddingBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-navy-800)" }}>
                  Order {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-gray-400)" }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", fontSize: "0.9rem" }}>
                <Field label="TRACKING NUMBER" value={selectedOrder.trackingNumber} strong />
                <Field label="CLIENT" value={selectedOrder.fullName} strong />
                <Field label="PHONE / WHATSAPP" value={selectedOrder.phone} />
                <Field label="CARGO TYPE" value={selectedOrder.cargoType} />
                <Field label="ROUTE" value={`${selectedOrder.fromCity} → ${selectedOrder.toCity}`} />
                <div>
                  <span style={{ color: "var(--color-gray-400)", display: "block", fontSize: "0.75rem", fontWeight: 700 }}>AGREED RATE</span>
                  <span style={{ fontWeight: 900, color: "var(--color-gold-700)" }}>AED {selectedOrder.agreedRate.toLocaleString()}</span>
                </div>
                <Field label="PLACED ON" value={new Date(selectedOrder.createdAt).toLocaleString()} />
                <div>
                  <span style={{ color: "var(--color-gray-400)", display: "block", fontSize: "0.75rem", fontWeight: 700 }}>STATUS</span>
                  <span className={`status-badge status-badge--${selectedOrder.status}`} style={{ fontWeight: 700 }}>
                    {label(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--color-gray-100)", paddingTop: "1.25rem" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--color-navy-800)", marginBottom: "0.5rem" }}>Notes</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-gray-600)" }}>{selectedOrder.notes}</p>
                </div>
              )}

              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-primary" style={{ padding: "0.5rem 1.5rem" }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <span style={{ color: "var(--color-gray-400)", display: "block", fontSize: "0.75rem", fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: strong ? 700 : 500, color: strong ? "var(--color-navy-900)" : undefined }}>{value}</span>
    </div>
  );
}
