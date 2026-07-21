"use client";

import Link from "next/link";
import {
  MdLocalShipping,
  MdPending,
  MdFlightTakeoff,
  MdCheckCircle,
  MdReceipt,
  MdLocationOn,
  MdAdd,
  MdArrowForward,
  MdAccessTime,
  MdPayment,
  MdNotifications,
} from "react-icons/md";
import { mockUser } from "@/data/mock/user";
import { mockOrders } from "@/data/mock/orders";
import { mockInvoices } from "@/data/mock/invoices";
import { mockNotifications } from "@/data/mock/notifications";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  customs: "At Customs",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const recentOrders = mockOrders.slice(0, 5);
const overdueInvoices = mockInvoices.filter((i) => i.status === "overdue").length;
const unreadNotifs = mockNotifications.filter((n) => !n.read).length;

const stats = [
  {
    label: "Total Orders",
    value: mockOrders.length,
    icon: <MdLocalShipping />,
    color: "blue",
    trend: "+2 this week",
    trendUp: true,
  },
  {
    label: "Pending",
    value: mockOrders.filter((o) => o.status === "pending" || o.status === "processing").length,
    icon: <MdPending />,
    color: "amber",
    trend: "Awaiting pickup",
    trendUp: false,
  },
  {
    label: "In Transit",
    value: mockOrders.filter((o) => o.status === "in_transit" || o.status === "customs").length,
    icon: <MdFlightTakeoff />,
    color: "cyan",
    trend: "Active shipments",
    trendUp: true,
  },
  {
    label: "Delivered",
    value: mockOrders.filter((o) => o.status === "delivered").length,
    icon: <MdCheckCircle />,
    color: "green",
    trend: "All time",
    trendUp: true,
  },
];

const quickActions = [
  { href: "/portal/book-shipment", icon: <MdAdd />, label: "Book Shipment" },
  { href: "/portal/tracking", icon: <MdLocationOn />, label: "Track Order" },
  { href: "/portal/invoices", icon: <MdReceipt />, label: "View Invoices" },
  { href: "/portal/notifications", icon: <MdNotifications />, label: "Notifications" },
];

const activityFeed = [
  { icon: <MdCheckCircle />, color: "green", title: "Shipment Delivered", desc: "ORD-2024-001 delivered to Riyadh", time: "2h ago" },
  { icon: <MdPayment />, color: "amber", title: "Invoice Overdue", desc: "INV-2025-005 — AED 8,200 outstanding", time: "5h ago" },
  { icon: <MdFlightTakeoff />, color: "cyan", title: "In Transit", desc: "ORD-2024-002 heading to Doha via sea", time: "1d ago" },
  { icon: <MdAdd />, color: "navy", title: "New Booking", desc: "Villa shifting ORD-2025-004 confirmed", time: "2d ago" },
  { icon: <MdLocationOn />, color: "purple", title: "Customs Update", desc: "ORD-2024-003 cleared Oman border", time: "3d ago" },
];

export default function DashboardPage() {
  const totalSpend = mockOrders.reduce((s, o) => s + o.amount, 0).toLocaleString();

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner__text">
          <p className="welcome-banner__greeting">Good morning,</p>
          <h1 className="welcome-banner__name">
            {mockUser.firstName} {mockUser.lastName} 👋
          </h1>
          <p className="welcome-banner__sub">
            {mockUser.company} &nbsp;•&nbsp; Customer since{" "}
            {new Date(mockUser.createdAt).getFullYear()}
          </p>
        </div>
        <div className="welcome-banner__badge">
          <div className="welcome-banner__badge-value">AED {totalSpend}</div>
          <div className="welcome-banner__badge-label">Total Spend</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-card__icon stat-card__icon--${s.color}`}>{s.icon}</div>
            <div className="stat-card__info">
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
              <div className={`stat-card__trend stat-card__trend--${s.trendUp ? "up" : "down"}`}>
                {s.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div>
          <div className="panel" style={{ marginBottom: "1.5rem" }}>
            <div className="panel__header">
              <h2 className="panel__title">Recent Orders</h2>
              <Link href="/portal/orders" className="panel__action">
                View all <MdArrowForward style={{ verticalAlign: "middle" }} />
              </Link>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Service</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div>
                          <Link href={`/portal/orders/${order.id}`} className="data-table__link data-table__id">
                            {order.id}
                          </Link>
                          <div className="data-table__tracking">{order.trackingNumber}</div>
                        </div>
                      </td>
                      <td>{order.service}</td>
                      <td style={{ fontSize: "0.8rem" }}>
                        {order.origin} → {order.destination}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${order.status}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--color-navy-700)" }}>
                        AED {order.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Quick Actions</h2>
            </div>
            <div className="panel__body">
              <div className="quick-actions">
                {quickActions.map((qa) => (
                  <Link key={qa.href} href={qa.href} className="quick-action">
                    <span className="quick-action__icon">{qa.icon}</span>
                    {qa.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Alerts */}
          {(overdueInvoices > 0 || unreadNotifs > 0) && (
            <div
              style={{
                background: "rgba(245,158,11,0.07)",
                border: "1.5px solid rgba(245,158,11,0.2)",
                borderRadius: "0.875rem",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ fontWeight: 700, color: "#b45309", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                ⚠ Needs Attention
              </div>
              {overdueInvoices > 0 && (
                <div style={{ fontSize: "0.82rem", color: "var(--color-gray-600)", marginBottom: "0.3rem" }}>
                  {overdueInvoices} overdue invoice{overdueInvoices > 1 ? "s" : ""} —{" "}
                  <Link href="/portal/invoices" style={{ color: "var(--color-navy-600)", fontWeight: 600 }}>
                    Pay now
                  </Link>
                </div>
              )}
              {unreadNotifs > 0 && (
                <div style={{ fontSize: "0.82rem", color: "var(--color-gray-600)" }}>
                  {unreadNotifs} unread notification{unreadNotifs > 1 ? "s" : ""} —{" "}
                  <Link href="/portal/notifications" style={{ color: "var(--color-navy-600)", fontWeight: 600 }}>
                    View
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Activity Timeline */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Recent Activity</h2>
              <MdAccessTime style={{ color: "var(--color-gray-400)", fontSize: "1.1rem" }} />
            </div>
            <div className="panel__body" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {activityFeed.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      paddingBottom: i < activityFeed.length - 1 ? "1rem" : 0,
                      borderBottom: i < activityFeed.length - 1 ? "1px solid var(--color-gray-100)" : "none",
                      marginBottom: i < activityFeed.length - 1 ? "1rem" : 0,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                          item.color === "green"
                            ? "rgba(16,185,129,0.1)"
                            : item.color === "amber"
                            ? "rgba(245,158,11,0.1)"
                            : item.color === "cyan"
                            ? "rgba(6,182,212,0.1)"
                            : item.color === "purple"
                            ? "rgba(139,92,246,0.1)"
                            : "rgba(15,31,54,0.07)",
                        color:
                          item.color === "green"
                            ? "#10b981"
                            : item.color === "amber"
                            ? "#f59e0b"
                            : item.color === "cyan"
                            ? "#06b6d4"
                            : item.color === "purple"
                            ? "#8b5cf6"
                            : "var(--color-navy-700)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-navy-800)" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-gray-500)", marginTop: "0.1rem" }}>
                        {item.desc}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
