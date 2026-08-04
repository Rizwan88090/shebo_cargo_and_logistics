"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdStar, MdArrowForward, MdRateReview, MdClose } from "react-icons/md";
import { reviews as seedReviews } from "@/data/reviews";
import { reviewTranslationsAr } from "@/data/reviewsI18n";
import { serviceTagAr } from "@/data/countriesI18n";
import {
  listPublicReviews,
  submitReview,
  REVIEWS_UPDATED_EVENT,
  type ReviewEntry,
} from "@/lib/reviews";
import { useLanguage } from "@/config/i18n";
import styles from "./reviews.module.css";

interface DisplayReview {
  id: string;
  name: string;
  company?: string | null;
  rating: number;
  text: string;
  service?: string | null;
  date: string;
  avatar: string;
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export default function ReviewsPage() {
  const { t, locale } = useLanguage();
  const tr = t.reviewsPage;
  const isAr = locale === "ar";

  const [selectedRating, setSelectedRating] = useState<number | "All">("All");
  const [backend, setBackend] = useState<ReviewEntry[]>([]);

  // Modal + form state
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", rating: 5, service: "", text: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const load = useCallback(() => {
    listPublicReviews()
      .then(setBackend)
      .catch(() => setBackend([]));
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener(REVIEWS_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    // Poll so new customer reviews appear live, without a manual refresh.
    const interval = setInterval(load, 10000);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [load]);

  // ——— Build the combined display list: live backend reviews first, seed after ———
  const backendDisplay: DisplayReview[] = backend.map((r) => ({
    id: r.id,
    name: r.name,
    company: r.company,
    rating: r.rating,
    text: r.text,
    service: r.service,
    date: fmtDate(r.createdAt),
    avatar: initials(r.name),
  }));

  const seedDisplay: DisplayReview[] = seedReviews.map((r) => {
    const ov = isAr ? reviewTranslationsAr[r.id] : undefined;
    return {
      id: `seed-${r.id}`,
      name: r.name,
      company: ov?.company ?? r.company,
      rating: r.rating,
      text: ov?.text ?? r.text,
      service: isAr ? serviceTagAr[r.service] ?? r.service : r.service,
      date: r.date,
      avatar: r.avatar,
    };
  });

  const allReviews = [...backendDisplay, ...seedDisplay];
  const total = allReviews.length;
  const averageRating = total
    ? Math.round((allReviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0;

  const filteredReviews =
    selectedRating === "All" ? allReviews : allReviews.filter((r) => r.rating === selectedRating);

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = allReviews.filter((r) => r.rating === stars).length;
    const percentage = total ? Math.round((count / total) * 100) : 0;
    return { stars, count, percentage };
  });

  const serviceOptions = t.contactPage.serviceOptions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await submitReview({
        name: form.name,
        company: form.company || undefined,
        rating: form.rating,
        text: form.text,
        service: form.service || undefined,
      });
      setStatus("success");
      setForm({ name: "", company: "", rating: 5, service: "", text: "" });
      load();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : tr.formError);
      setStatus("error");
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setStatus("idle");
    setErrorMsg("");
  };

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
            {tr.heroTitle}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tr.heroSubtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{tr.home}</Link>
            <span>/</span>
            <span>{tr.reviews}</span>
          </div>
        </div>
      </section>

      {/* Main Reviews Section */}
      <section className="section">
        <div className="container">
          <div className={styles.reviewsLayout}>
            {/* Reviews Metrics Sidebar */}
            <div className={styles.sidebarColumn}>
              <div className={styles.ratingCard}>
                <h3 className={styles.cardHeading}>{tr.overallRating}</h3>
                <div className={styles.ratingScore}>{averageRating}</div>
                <div className={styles.starsWrapper}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MdStar
                      key={i}
                      className={i < Math.round(averageRating) ? styles.starGold : styles.starGray}
                    />
                  ))}
                </div>
                <p className={styles.reviewsCount}>{tr.basedOn.replace("{n}", String(total))}</p>

                {/* Rating Distribution */}
                <div className={styles.distributionList}>
                  {ratingDistribution.map((dist) => (
                    <button
                      key={dist.stars}
                      className={`${styles.distRow} ${
                        selectedRating === dist.stars ? styles.distRowActive : ""
                      }`}
                      onClick={() =>
                        setSelectedRating(selectedRating === dist.stars ? "All" : dist.stars)
                      }
                    >
                      <span className={styles.distLabel}>
                        {dist.stars} {tr.starWord}
                      </span>
                      <div className={styles.progressBarWrapper}>
                        <div className={styles.progressBar} style={{ width: `${dist.percentage}%` }} />
                      </div>
                      <span className={styles.distCount}>{dist.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Write a Review CTA */}
              <div className={styles.writeReviewCard}>
                <MdRateReview className={styles.writeIcon} />
                <h3>{tr.shareTitle}</h3>
                <p>{tr.shareText}</p>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => setFormOpen(true)}
                >
                  {tr.writeReview}
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className={styles.listColumn}>
              {/* Filter Tabs */}
              <div className={styles.tabsWrapper}>
                <button
                  className={`${styles.tabBtn} ${selectedRating === "All" ? styles.tabBtnActive : ""}`}
                  onClick={() => setSelectedRating("All")}
                >
                  {tr.allReviews.replace("{n}", String(total))}
                </button>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = allReviews.filter((r) => r.rating === stars).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={stars}
                      className={`${styles.tabBtn} ${selectedRating === stars ? styles.tabBtnActive : ""}`}
                      onClick={() => setSelectedRating(stars)}
                    >
                      {tr.starsTab.replace("{n}", String(stars)).replace("{c}", String(count))}
                    </button>
                  );
                })}
              </div>

              {/* Reviews Grid */}
              <motion.div layout className={styles.reviewsGrid}>
                <AnimatePresence mode="popLayout">
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={styles.reviewCard}
                    >
                      <div className={styles.reviewHeader}>
                        <div className={styles.avatar}>{review.avatar}</div>
                        <div>
                          <h4 className={styles.authorName}>{review.name}</h4>
                          {review.company && <p className={styles.authorCompany}>{review.company}</p>}
                        </div>
                        {review.service && <span className={styles.serviceBadge}>{review.service}</span>}
                      </div>

                      <div className={styles.ratingStars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <MdStar
                            key={i}
                            className={i < review.rating ? styles.starGold : styles.starGray}
                          />
                        ))}
                      </div>

                      <p className={styles.reviewText}>&ldquo;{review.text}&rdquo;</p>
                      <span className={styles.reviewDate}>{review.date}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="section section--dark" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="section-heading__title" style={{ color: "var(--color-white)" }}>
            {tr.ctaTitle}
          </h2>
          <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
            {tr.ctaSub}
          </p>
          <Link href="/request-quote" className="btn btn-primary btn-lg">
            {tr.requestFreeQuote} <MdArrowForward style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
          </Link>
        </div>
      </section>

      {/* ——— Write-a-Review Modal ——— */}
      <AnimatePresence>
        {formOpen && (
          <div className={styles.modalOverlay} onClick={closeForm}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              dir={isAr ? "rtl" : "ltr"}
            >
              <button className={styles.modalClose} onClick={closeForm} aria-label={tr.formClose}>
                <MdClose />
              </button>

              {status === "success" ? (
                <div className={styles.modalSuccess}>
                  <MdRateReview className={styles.writeIcon} />
                  <h3>{tr.formThanks}</h3>
                  <button className="btn btn-primary" onClick={closeForm}>
                    {tr.formClose}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.reviewForm}>
                  <h3 className={styles.modalTitle}>{tr.writeReview}</h3>

                  <div className="form-group">
                    <label className="form-label">{tr.formName} *</label>
                    <input
                      className="form-input"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{tr.formCompany}</label>
                    <input
                      className="form-input"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{tr.formRating} *</label>
                    <div className={styles.starPicker}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setForm({ ...form, rating: n })}
                          className={styles.starPickBtn}
                          aria-label={`${n}`}
                        >
                          <MdStar className={n <= form.rating ? styles.starGold : styles.starGray} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{tr.formService}</label>
                    <select
                      className="form-select"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option value="">{tr.formSelectService}</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{tr.formReview} *</label>
                    <textarea
                      className="form-textarea"
                      required
                      placeholder={tr.formReviewPlaceholder}
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                    />
                  </div>

                  {status === "error" && errorMsg && (
                    <p role="alert" style={{ color: "var(--color-error, #dc2626)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? tr.formSubmitting : tr.formSubmit}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
