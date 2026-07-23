"use client";

import { useEffect, useState } from "react";
import { MdSearch, MdLocationOn, MdCheck } from "react-icons/md";
import { trackOrder, buildOrderTimeline, type Order } from "@/lib/orders";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  customs: "At Customs",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const POLL_MS = 10000;

export default function TrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Order | null | "not_found">(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    const found = await trackOrder(q);
    setResult(found ?? "not_found");
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // Keep the result live — reflects admin status updates without a manual re-search.
  useEffect(() => {
    if (!result || result === "not_found") return;
    const trackingNumber = result.trackingNumber;
    const interval = setInterval(async () => {
      const fresh = await trackOrder(trackingNumber);
      if (fresh) setResult(fresh);
    }, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result === "not_found" ? null : (result as Order | null)?.id]);

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Track Shipment</h1>
        <p className="portal-page__subtitle">
          Enter a tracking number or order ID to see real-time status updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="tracking-search">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-gray-700)" }}>
            Tracking Number / Order ID
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--color-gray-50)",
              border: "1.5px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              padding: "0.6rem 1rem",
            }}
          >
            <MdSearch style={{ color: "var(--color-gray-400)", fontSize: "1.2rem" }} />
            <input
              type="text"
              placeholder="e.g. MRD-AE-78451236 or ORD-2026-0001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                color: "var(--color-gray-800)",
                flex: 1,
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </div>
        <button className="btn btn--primary" onClick={handleSearch} disabled={loading} style={{ alignSelf: "flex-end" }}>
          <MdSearch /> {loading ? "Searching…" : "Track"}
        </button>
      </div>

      {/* Results */}
      {result === "not_found" && (
        <div className="empty-state" style={{ background: "#fff", borderRadius: "1rem", border: "1px solid var(--color-gray-100)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__title">No shipment found</p>
          <p className="empty-state__text">
            Check the tracking number or order ID and try again.
          </p>
        </div>
      )}

      {result && result !== "not_found" && (
        <div className="tracking-result">
          {/* Header */}
          <div className="tracking-result__header">
            <div>
              <div className="tracking-result__number">{result.trackingNumber}</div>
              <div className="tracking-result__route">
                {result.fromCity} → {result.toCity}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-gray-400)", marginTop: "0.25rem" }}>
                {result.cargoType} &nbsp;•&nbsp; Order {result.orderNumber}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`status-badge status-badge--${result.status}`} style={{ fontSize: "0.85rem", padding: "0.35rem 1rem" }}>
                {statusLabels[result.status]}
              </span>
              <div style={{ fontSize: "0.8rem", color: "var(--color-gray-500)", marginTop: "0.5rem" }}>
                Agreed rate: <strong>{result.agreedRate != null ? `AED ${result.agreedRate.toLocaleString()}` : "Awaiting quote"}</strong>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: "0.5rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
              Shipment Progress
            </div>

            {/* Horizontal visual timeline */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {buildOrderTimeline(result).map((step, i, timeline) => {
                const isCompleted = step.completed;
                const isCurrent =
                  !step.completed && i > 0 && timeline[i - 1]?.completed && result.status !== "cancelled";
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      {i > 0 && (
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: isCompleted || isCurrent
                            ? "var(--color-success)"
                            : "var(--color-gray-200)",
                        }} />
                      )}
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: "50%",
                        background: isCompleted
                          ? "var(--color-success)"
                          : isCurrent
                          ? "var(--color-info)"
                          : "var(--color-gray-200)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isCompleted || isCurrent ? "#fff" : "var(--color-gray-400)",
                        fontSize: isCompleted ? "1rem" : "0.8rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        boxShadow: isCurrent ? "0 0 0 4px rgba(59,130,246,0.15)" : "none",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        {isCompleted ? <MdCheck /> : i + 1}
                      </div>
                      {i < timeline.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: timeline[i + 1]?.completed
                            ? "var(--color-success)"
                            : "var(--color-gray-200)",
                        }} />
                      )}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: isCompleted || isCurrent ? 600 : 400, color: isCompleted ? "var(--color-success)" : isCurrent ? "var(--color-info)" : "var(--color-gray-400)" }}>
                        {step.step}
                      </div>
                      {step.date && (
                        <div style={{ fontSize: "0.68rem", color: "var(--color-gray-400)", marginTop: "0.15rem" }}>
                          {step.date}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="tracking-map-placeholder">
            <MdLocationOn style={{ fontSize: "1.5rem" }} />
            <span>Live status — refreshes automatically every few seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}
