"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MdArrowBack, MdLocationOn, MdScale, MdCalendarToday, MdReceipt, MdCheck } from "react-icons/md";
import { mockOrders } from "@/data/mock/orders";
import { mockInvoices } from "@/data/mock/invoices";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  customs: "At Customs",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="empty-state" style={{ paddingTop: "6rem" }}>
        <div className="empty-state__icon">📦</div>
        <p className="empty-state__title">Order Not Found</p>
        <p className="empty-state__text">The order ID you requested does not exist.</p>
        <Link href="/portal/orders" className="btn btn--primary" style={{ marginTop: "1.25rem" }}>
          <MdArrowBack /> Back to Orders
        </Link>
      </div>
    );
  }

  const invoice = mockInvoices.find((inv) => inv.orderId === order.id);

  return (
    <div>
      {/* Back + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <Link href="/portal/orders" className="btn btn--outline btn--sm">
          <MdArrowBack /> Orders
        </Link>
        <div style={{ flex: 1 }}>
          <h1 className="portal-page__title" style={{ margin: 0 }}>{order.id}</h1>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-gray-500)" }}>
            Tracking: <strong>{order.trackingNumber}</strong>
          </p>
        </div>
        <span className={`status-badge status-badge--${order.status}`} style={{ fontSize: "0.85rem", padding: "0.35rem 1rem" }}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Status Timeline */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Shipment Progress</h2>
            </div>
            <div className="panel__body">
              <div className="order-timeline">
                {order.timeline.map((step, i) => {
                  const isCompleted = step.completed;
                  const isCurrent =
                    !step.completed &&
                    i > 0 &&
                    order.timeline[i - 1]?.completed &&
                    order.status !== "cancelled";
                  return (
                    <div
                      key={i}
                      className={`order-timeline__step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                    >
                      <div className="order-timeline__dot">
                        {isCompleted && <MdCheck />}
                      </div>
                      <div className="order-timeline__info">
                        <div className="order-timeline__label">{step.step}</div>
                        {step.date && <div className="order-timeline__date">{step.date}</div>}
                        {!step.date && !isCompleted && (
                          <div className="order-timeline__date">Pending</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Package Details</h2>
            </div>
            <div className="panel__body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "1rem",
                }}
              >
                {[
                  { icon: <MdScale />, label: "Weight", value: order.weight },
                  { icon: <MdLocationOn />, label: "Dimensions", value: order.dimensions },
                  { icon: <MdReceipt />, label: "Cargo Type", value: order.cargoType },
                  { icon: <MdCalendarToday />, label: "Est. Delivery", value: new Date(order.estimatedDelivery).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" }) },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "var(--color-gray-50)",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      border: "1px solid var(--color-gray-100)",
                    }}
                  >
                    <div style={{ color: "var(--color-navy-500)", fontSize: "1.2rem", marginBottom: "0.4rem" }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-navy-800)", marginTop: "0.2rem" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Route */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Route</h2>
            </div>
            <div className="panel__body">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Origin
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--color-navy-800)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MdLocationOn style={{ color: "var(--color-navy-500)" }} />
                    {order.origin}
                  </div>
                </div>
                <div style={{ borderLeft: "2px dashed var(--color-gray-300)", marginLeft: "0.6rem", height: "24px" }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Destination
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--color-navy-800)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MdLocationOn style={{ color: "var(--color-success)" }} />
                    {order.destination}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Summary</h2>
            </div>
            <div className="panel__body">
              {[
                { label: "Service", value: order.service },
                { label: "Order Date", value: new Date(order.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" }) },
                { label: "Order Amount", value: `AED ${order.amount.toLocaleString()}` },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--color-gray-100)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--color-gray-500)" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--color-navy-800)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Link */}
          {invoice && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(15,31,54,0.05), rgba(26,58,92,0.03))",
                border: "1.5px solid var(--color-gray-200)",
                borderRadius: "0.875rem",
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Invoice
                </div>
                <div style={{ fontWeight: 700, color: "var(--color-navy-800)", marginTop: "0.2rem" }}>
                  {invoice.id}
                </div>
                <span className={`status-badge status-badge--${invoice.status}`} style={{ marginTop: "0.4rem" }}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <Link href={`/portal/invoices/${invoice.id}`} className="btn btn--primary btn--sm">
                View <MdArrowBack style={{ transform: "scaleX(-1)" }} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
