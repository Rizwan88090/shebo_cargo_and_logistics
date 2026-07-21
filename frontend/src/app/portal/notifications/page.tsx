"use client";

import { useState } from "react";
import { MdShoppingCart, MdPayment, MdSettings, MdCheckCircle, MdDone } from "react-icons/md";
import { mockNotifications, Notification } from "@/data/mock/notifications";

const TYPE_FILTERS = ["all", "order", "payment", "system"] as const;
const typeLabels: Record<string, string> = { all: "All", order: "Orders", payment: "Payments", system: "System" };

const typeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order": return <MdShoppingCart />;
    case "payment": return <MdPayment />;
    case "system": return <MdSettings />;
  }
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter(
    (n) => filter === "all" || n.type === filter
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div>
      <div className="portal-page__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="portal-page__title">
            Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "0.75rem",
                  background: "var(--color-gold-500)",
                  color: "var(--color-navy-900)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  verticalAlign: "middle",
                }}
              >
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="portal-page__subtitle">Stay updated on your shipments, payments, and account activity.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn--outline btn--sm" onClick={markAllRead}>
            <MdDone /> Mark all read
          </button>
        )}
      </div>

      <div className="panel">
        {/* Type Filter */}
        <div className="table-controls">
          <div className="table-controls__filter">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {typeLabels[f]}
                {f !== "all" && (
                  <span style={{ marginLeft: "0.35rem", opacity: 0.7 }}>
                    ({notifications.filter((n) => n.type === f && !n.read).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="notif-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔔</div>
              <p className="empty-state__title">No notifications</p>
              <p className="empty-state__text">You&apos;re all caught up!</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${!notif.read ? "notif-item--unread" : ""}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`notif-item__icon-wrap notif-item__icon-wrap--${notif.type}`}>
                  {typeIcon(notif.type)}
                </div>
                <div className="notif-item__body">
                  <p className="notif-item__title">{notif.title}</p>
                  <p className="notif-item__message">{notif.message}</p>
                </div>
                <div className="notif-item__time">{notif.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
