"use client";

import { useState } from "react";
import { MdStar, MdClose } from "react-icons/md";
import styles from "./GoogleReviews.module.css";

const miniReviews = [
  { name: "Mohammed K.", text: "Excellent service! Fast delivery.", rating: 5 },
  { name: "Sara A.", text: "Very professional team, highly recommend.", rating: 5 },
  { name: "Ahmad R.", text: "Best cargo company in Dubai.", rating: 5 },
  { name: "Fatima H.", text: "Smooth relocation experience.", rating: 4 },
];

export default function GoogleReviews() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Badge */}
      <button
        className={`${styles.badge} ${expanded ? styles.badgeHidden : ""}`}
        onClick={() => setExpanded(true)}
        aria-label="View Google Reviews"
        id="google-reviews-badge"
      >
        <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <div className={styles.badgeInfo}>
          <span className={styles.badgeRating}>4.9</span>
          <div className={styles.badgeStars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MdStar key={i} className={styles.starGold} />
            ))}
          </div>
        </div>
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className={styles.overlay} onClick={() => setExpanded(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderLeft}>
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <h4 className={styles.panelTitle}>Google Reviews</h4>
                  <p className={styles.panelSub}>Shebo Cargo & Logistics</p>
                </div>
              </div>
              <button className={styles.panelClose} onClick={() => setExpanded(false)} aria-label="Close">
                <MdClose />
              </button>
            </div>

            <div className={styles.panelRating}>
              <span className={styles.ratingBig}>4.9</span>
              <div>
                <div className={styles.ratingStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MdStar key={i} className={styles.starGold} />
                  ))}
                </div>
                <p className={styles.ratingCount}>Based on 247 reviews</p>
              </div>
            </div>

            <div className={styles.reviewsList}>
              {miniReviews.map((r, i) => (
                <div key={i} className={styles.reviewItem}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewAvatar}>{r.name[0]}</div>
                    <div>
                      <p className={styles.reviewName}>{r.name}</p>
                      <div className={styles.reviewStars}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <MdStar
                            key={j}
                            className={j < r.rating ? styles.starGold : styles.starGray}
                            style={{ fontSize: "0.75rem" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>

            <a
              href="https://g.co/kgs/shebocargo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelCta}
            >
              View all reviews on Google
            </a>
          </div>
        </div>
      )}
    </>
  );
}
