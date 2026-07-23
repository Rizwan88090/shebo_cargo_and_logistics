"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdLocationOn, MdCheck } from "react-icons/md";
import { trackOrder, buildOrderTimeline, type Order } from "@/lib/orders";
import { useLanguage } from "@/config/i18n";
import styles from "./tracking.module.css";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  customs: "At Customs",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const POLL_MS = 10000;

export default function PublicTrackingPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Order | null | "not_found">(null);
  const [loading, setLoading] = useState(false);
  const searchedRef = useRef<string | null>(null);

  const runSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    searchedRef.current = trimmed;
    const found = await trackOrder(trimmed);
    setResult(found ?? "not_found");
    setLoading(false);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runSearch(query);
  };

  // Auto-search when arriving with ?number=... (e.g. from the Order confirmation).
  useEffect(() => {
    const num = new URLSearchParams(window.location.search).get("number");
    if (num) {
      setQuery(num);
      runSearch(num.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the result live — reflects admin status updates without a manual re-search.
  useEffect(() => {
    if (!result || result === "not_found" || !searchedRef.current) return;
    const trackingNumber = result.trackingNumber;
    const interval = setInterval(async () => {
      const fresh = await trackOrder(trackingNumber);
      if (fresh) setResult(fresh);
    }, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result === "not_found" ? null : (result as Order | null)?.id]);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__content container">
          <motion.h1
            className="page-hero__title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t.tracking.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.tracking.subtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{t.nav.home}</Link>
            <span>/</span>
            <span>{t.nav.tracking}</span>
          </div>
        </div>
      </section>

      {/* Main search and tracking flow */}
      <section className="section section--light">
        <div className="container">
          <div className={styles.searchContainer}>
            <label className={styles.searchLabel}>{t.tracking.title}</label>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <MdSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder={t.tracking.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Searching…" : t.tracking.trackBtn}
              </button>
            </form>
            <p style={{ fontSize: "0.78rem", color: "var(--color-gray-400)", marginTop: "0.75rem" }}>
              Use the tracking number or order number from your confirmation SMS/email
              (e.g. MRD-AE-XXXXXXXX or ORD-2026-XXXX).
            </p>
          </div>

          <AnimatePresence mode="wait">
            {result === "not_found" && (
              <motion.div
                key="not_found"
                className="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ background: "#fff", borderRadius: "1rem", maxWidth: "800px", margin: "2rem auto" }}
              >
                <div className="empty-state__icon">🔍</div>
                <h3 className="empty-state__title">{t.tracking.notFound}</h3>
                <p className="empty-state__text">{t.tracking.notFoundDesc}</p>
              </motion.div>
            )}

            {result && result !== "not_found" && (
              <motion.div
                key={result.id}
                className={styles.resultPanel}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Result header */}
                <div className={styles.resultHeader}>
                  <div>
                    <h3 className={styles.resultTitle}>{result.trackingNumber}</h3>
                    <p className={styles.resultRoute}>
                      {result.fromCity} → {result.toCity}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", marginTop: "4px" }}>
                      {result.cargoType} &nbsp;•&nbsp; Order {result.orderNumber}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className={`status-badge status-badge--${result.status}`}>
                      {statusLabels[result.status]}
                    </span>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-gray-400)", marginTop: "8px" }}>
                      Agreed rate: <strong>{result.agreedRate != null ? `AED ${result.agreedRate.toLocaleString()}` : "Awaiting quote"}</strong>
                    </p>
                  </div>
                </div>

                {/* Progress line timeline */}
                <div style={{ margin: "2rem 0" }}>
                  <h4 style={{ fontSize: "0.8rem", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
                    {t.tracking.shipmentProgress}
                  </h4>

                  <div className={styles.timeline}>
                    {buildOrderTimeline(result).map((step, idx, timeline) => {
                      const isCompleted = step.completed;
                      const isCurrent =
                        !step.completed &&
                        idx > 0 &&
                        timeline[idx - 1]?.completed &&
                        result.status !== "cancelled";

                      return (
                        <div key={idx} className={styles.timelineStep}>
                          {idx < timeline.length - 1 && (
                            <div
                              className={`${styles.stepLine} ${
                                timeline[idx + 1]?.completed ? styles.stepLineCompleted : ""
                              }`}
                            />
                          )}
                          <div
                            className={`${styles.stepCircle} ${
                              isCompleted ? styles.stepCompleted : isCurrent ? styles.stepActive : ""
                            }`}
                          >
                            {isCompleted ? <MdCheck /> : idx + 1}
                          </div>
                          <div
                            className={`${styles.stepLabel} ${
                              isCompleted
                                ? styles.stepLabelCompleted
                                : isCurrent
                                ? styles.stepLabelActive
                                : ""
                            }`}
                          >
                            {step.step}
                            {step.date && <div className={styles.stepDate}>{step.date}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Interactive Map */}
                <div className={styles.mapPlaceholder}>
                  <MdLocationOn style={{ fontSize: "2rem", color: "var(--color-gold-500)" }} />
                  <p>Live status updates every few seconds</p>
                  <p style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 400 }}>
                    Route: {result.fromCity} → {result.toCity}
                  </p>
                  <div className={styles.mapMarkerPulse} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
