"use client";

import { useState, useEffect, useCallback } from "react";
import { MdSearch, MdDelete, MdMarkEmailRead, MdEmail, MdPhone, MdOutlineMarkChatUnread } from "react-icons/md";
import {
  listMessages,
  markMessageRead,
  deleteMessage,
  MESSAGES_UPDATED_EVENT,
  type Message,
} from "@/lib/messages";
import { useToast } from "@/components/ui/NotificationToast";

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("meridian_token") ?? undefined;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminMessagesPage() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(() => {
    listMessages(getToken())
      .then(setMessages)
      .catch((err) => {
        setMessages([]);
        addToast(
          "error",
          "Could not load messages",
          err instanceof Error ? err.message : "Please refresh and try again.",
        );
      });
  }, [addToast]);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener(MESSAGES_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    // Poll so new customer messages appear live, without a manual refresh.
    const interval = setInterval(load, 8000);
    return () => {
      window.removeEventListener(MESSAGES_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [load]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filtered = messages.filter((m) => {
    const hay = `${m.name} ${m.email} ${m.phone ?? ""} ${m.service ?? ""} ${m.message}`.toLowerCase();
    const matchesSearch = hay.includes(search.toLowerCase());
    const matchesFilter = filter === "all" || !m.isRead;
    return matchesSearch && matchesFilter;
  });

  const handleMarkRead = async (m: Message) => {
    try {
      await markMessageRead(m.id, getToken());
      load();
    } catch (err) {
      addToast("error", "Could not update", err instanceof Error ? err.message : "Please try again.");
    }
  };

  const handleDelete = async (m: Message) => {
    try {
      await deleteMessage(m.id, getToken());
      addToast("info", "Message deleted", `Message from ${m.name} removed.`);
      load();
    } catch (err) {
      addToast("error", "Could not delete", err instanceof Error ? err.message : "Please try again.");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <div className="portal-page__header" style={{ marginBottom: "2rem" }}>
        <h1 className="portal-page__title" style={{ fontSize: "2rem", fontWeight: 900 }}>
          Customer Messages
        </h1>
        <p className="portal-page__subtitle" style={{ color: "var(--color-gray-500)" }}>
          Contact-form enquiries land here in real time. Reply by phone, email or WhatsApp.
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
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "260px" }}>
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
              placeholder="Search by name, email, phone, message…"
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
            />
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(["all", "unread"] as const).map((f) => {
              const count = f === "all" ? messages.length : unreadCount;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    border: "1px solid transparent",
                    background: filter === f ? "var(--color-navy-800)" : "var(--color-gray-50)",
                    color: filter === f ? "var(--color-white)" : "var(--color-gray-600)",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {f} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Message list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-navy-800)" }}>No messages</h3>
            <p style={{ color: "var(--color-gray-400)" }}>
              Messages sent from the website contact form will appear here instantly.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((m) => (
              <div
                key={m.id}
                style={{
                  border: `1px solid ${m.isRead ? "var(--color-gray-100)" : "rgba(212,168,83,0.45)"}`,
                  background: m.isRead ? "var(--color-white)" : "rgba(212,168,83,0.05)",
                  borderRadius: "0.85rem",
                  padding: "1.25rem 1.4rem",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {!m.isRead && (
                      <span
                        title="Unread"
                        style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-gold-500)", flexShrink: 0, boxShadow: "0 0 0 3px rgba(212,168,83,0.2)" }}
                      />
                    )}
                    <strong style={{ fontSize: "1.02rem", color: "var(--color-navy-800)", fontWeight: 800 }}>{m.name}</strong>
                    {m.service && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          color: "var(--color-gold-700)",
                          background: "rgba(212,168,83,0.12)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "0.4rem",
                        }}
                      >
                        {m.service.replace(/-/g, " ")}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", whiteSpace: "nowrap" }}>{fmt(m.createdAt)}</span>
                </div>

                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", margin: "0.5rem 0 0.75rem" }}>
                  <a href={`mailto:${m.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: "var(--color-navy-700)", fontWeight: 600 }}>
                    <MdEmail /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: "var(--color-navy-700)", fontWeight: 600 }}>
                      <MdPhone /> {m.phone}
                    </a>
                  )}
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--color-gray-600)", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{m.message}</p>

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.9rem" }}>
                  {!m.isRead && (
                    <button
                      onClick={() => handleMarkRead(m)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.85rem", borderRadius: "0.5rem", border: "none", background: "var(--color-navy-800)", color: "#fff", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                    >
                      <MdMarkEmailRead size={15} /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.85rem", borderRadius: "0.5rem", border: "1px solid var(--color-gray-200)", background: "var(--color-white)", color: "var(--color-error, #dc2626)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    <MdDelete size={15} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {unreadCount > 0 && (
        <p style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", color: "var(--color-gold-700)", fontWeight: 700, fontSize: "0.85rem" }}>
          <MdOutlineMarkChatUnread /> {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
