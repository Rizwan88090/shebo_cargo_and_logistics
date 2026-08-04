"use client";

import { useState, useEffect, useCallback } from "react";
import { MdSearch, MdStar, MdDelete, MdVisibility, MdVisibilityOff } from "react-icons/md";
import {
  listAllReviews,
  setReviewApproved,
  deleteReview,
  REVIEWS_UPDATED_EVENT,
  type ReviewEntry,
} from "@/lib/reviews";
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

export default function AdminReviewsPage() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "hidden">("all");

  const load = useCallback(() => {
    listAllReviews(getToken())
      .then(setReviews)
      .catch((err) => {
        setReviews([]);
        addToast("error", "Could not load reviews", err instanceof Error ? err.message : "Please refresh and try again.");
      });
  }, [addToast]);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener(REVIEWS_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    const interval = setInterval(load, 8000);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [load]);

  const hiddenCount = reviews.filter((r) => !r.isApproved).length;

  const filtered = reviews.filter((r) => {
    const hay = `${r.name} ${r.company ?? ""} ${r.service ?? ""} ${r.text}`.toLowerCase();
    const matchesSearch = hay.includes(search.toLowerCase());
    const matchesFilter = filter === "all" || !r.isApproved;
    return matchesSearch && matchesFilter;
  });

  const handleToggle = async (r: ReviewEntry) => {
    try {
      await setReviewApproved(r.id, !r.isApproved, getToken());
      addToast("info", r.isApproved ? "Review hidden" : "Review published", `${r.name}'s review updated.`);
      load();
    } catch (err) {
      addToast("error", "Could not update", err instanceof Error ? err.message : "Please try again.");
    }
  };

  const handleDelete = async (r: ReviewEntry) => {
    try {
      await deleteReview(r.id, getToken());
      addToast("info", "Review deleted", `${r.name}'s review removed.`);
      load();
    } catch (err) {
      addToast("error", "Could not delete", err instanceof Error ? err.message : "Please try again.");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <div className="portal-page__header" style={{ marginBottom: "2rem" }}>
        <h1 className="portal-page__title" style={{ fontSize: "2rem", fontWeight: 900 }}>
          Customer Reviews
        </h1>
        <p className="portal-page__subtitle" style={{ color: "var(--color-gray-500)" }}>
          Reviews submitted on the website appear here live. Hide or delete anything inappropriate.
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
              style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-gray-400)", fontSize: "1.25rem" }}
            />
            <input
              type="text"
              placeholder="Search by name, company, text…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", border: "2px solid var(--color-gray-200)", borderRadius: "0.5rem", outline: "none", fontSize: "0.9rem" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(["all", "hidden"] as const).map((f) => {
              const count = f === "all" ? reviews.length : hiddenCount;
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

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-navy-800)" }}>No reviews</h3>
            <p style={{ color: "var(--color-gray-400)" }}>Reviews submitted on the website will appear here instantly.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((r) => (
              <div
                key={r.id}
                style={{
                  border: `1px solid ${r.isApproved ? "var(--color-gray-100)" : "rgba(220,38,38,0.35)"}`,
                  background: r.isApproved ? "var(--color-white)" : "rgba(220,38,38,0.04)",
                  borderRadius: "0.85rem",
                  padding: "1.1rem 1.3rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "1rem", color: "var(--color-navy-800)", fontWeight: 800 }}>{r.name}</strong>
                      {r.company && <span style={{ fontSize: "0.8rem", color: "var(--color-gray-400)" }}>· {r.company}</span>}
                      {!r.isApproved && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.1)", padding: "0.15rem 0.5rem", borderRadius: "0.35rem" }}>
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "1px", marginTop: "0.25rem" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <MdStar key={i} style={{ color: i < r.rating ? "#d4a853" : "var(--color-gray-200)", fontSize: "1rem" }} />
                      ))}
                      {r.service && (
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-gold-700)", background: "rgba(212,168,83,0.12)", padding: "0.15rem 0.5rem", borderRadius: "0.35rem" }}>
                          {r.service}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", whiteSpace: "nowrap" }}>{fmt(r.createdAt)}</span>
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--color-gray-600)", lineHeight: 1.7, margin: "0.6rem 0 0.8rem", whiteSpace: "pre-wrap" }}>
                  &ldquo;{r.text}&rdquo;
                </p>

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleToggle(r)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.85rem", borderRadius: "0.5rem", border: "1px solid var(--color-gray-200)", background: "var(--color-white)", color: "var(--color-navy-800)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    {r.isApproved ? <><MdVisibilityOff size={15} /> Hide</> : <><MdVisibility size={15} /> Publish</>}
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
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
    </div>
  );
}
