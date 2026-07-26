"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdStar, MdArrowForward, MdRateReview } from "react-icons/md";
import { reviews, getAverageRating } from "@/data/reviews";
import { reviewTranslationsAr } from "@/data/reviewsI18n";
import { serviceTagAr } from "@/data/countriesI18n";
import { useLanguage } from "@/config/i18n";
import styles from "./reviews.module.css";

export default function ReviewsPage() {
  const { t, locale } = useLanguage();
  const tr = t.reviewsPage;
  const isAr = locale === "ar";
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");

  const averageRating = getAverageRating();

  // Localize review content (text / generic company / service label) for Arabic.
  const localizedReviews = reviews.map((r) => {
    if (!isAr) return r;
    const ov = reviewTranslationsAr[r.id];
    return {
      ...r,
      text: ov?.text ?? r.text,
      company: ov?.company ?? r.company,
      service: serviceTagAr[r.service] ?? r.service,
    };
  });

  const filteredReviews =
    selectedRating === "All"
      ? localizedReviews
      : localizedReviews.filter((r) => r.rating === selectedRating);

  // Compute distribution of stars
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = Math.round((count / reviews.length) * 100);
    return { stars, count, percentage };
  });

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
                      className={
                        i < Math.round(averageRating)
                          ? styles.starGold
                          : styles.starGray
                      }
                    />
                  ))}
                </div>
                <p className={styles.reviewsCount}>{tr.basedOn.replace("{n}", String(reviews.length))}</p>

                {/* Rating Distribution */}
                <div className={styles.distributionList}>
                  {ratingDistribution.map((dist) => (
                    <button
                      key={dist.stars}
                      className={`${styles.distRow} ${
                        selectedRating === dist.stars ? styles.distRowActive : ""
                      }`}
                      onClick={() =>
                        setSelectedRating(
                          selectedRating === dist.stars ? "All" : dist.stars
                        )
                      }
                    >
                      <span className={styles.distLabel}>{dist.stars} {tr.starWord}</span>
                      <div className={styles.progressBarWrapper}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className={styles.distCount}>{dist.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leave Review Cta */}
              <div className={styles.writeReviewCard}>
                <MdRateReview className={styles.writeIcon} />
                <h3>{tr.shareTitle}</h3>
                <p>{tr.shareText}</p>
                <Link href="/contact" className="btn btn-outline" style={{ width: "100%" }}>
                  {tr.leaveReview}
                </Link>
              </div>
            </div>

            {/* Reviews List */}
            <div className={styles.listColumn}>
              {/* Filter Tabs */}
              <div className={styles.tabsWrapper}>
                <button
                  className={`${styles.tabBtn} ${
                    selectedRating === "All" ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => setSelectedRating("All")}
                >
                  {tr.allReviews.replace("{n}", String(reviews.length))}
                </button>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.rating === stars).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={stars}
                      className={`${styles.tabBtn} ${
                        selectedRating === stars ? styles.tabBtnActive : ""
                      }`}
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
                          <p className={styles.authorCompany}>{review.company}</p>
                        </div>
                        <span className={styles.serviceBadge}>{review.service}</span>
                      </div>

                      <div className={styles.ratingStars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <MdStar
                            key={i}
                            className={
                              i < review.rating ? styles.starGold : styles.starGray
                            }
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
    </>
  );
}
