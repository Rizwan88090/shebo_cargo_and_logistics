"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import { useLanguage } from "@/config/i18n";
import styles from "./about.module.css";

export default function AboutPage() {
  const { t, locale } = useLanguage();
  const ta = t.aboutPage;
  const isAr = locale === "ar";

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
            {ta.heroTitle}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {ta.heroSubtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{ta.home}</Link>
            <span>/</span>
            <span>{ta.about}</span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="section-heading" style={{ textAlign: "left", marginBottom: "var(--space-6)" }}>
                <span className="section-heading__label" style={{ justifyContent: "flex-start" }}>{ta.storyLabel}</span>
                <h2 className="section-heading__title" style={{ textAlign: "left" }}>{ta.storyTitle}</h2>
              </div>
              <p className={styles.paragraph}>{ta.storyP1}</p>
              <p className={styles.paragraph}>{ta.storyP2}</p>
              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>{ta.bullet1}</span>
                </div>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>{ta.bullet2}</span>
                </div>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>{ta.bullet3}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.storyImageWrapper}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={styles.imageOverlay} />
              <Image
                src="/images/hero-bg.png"
                alt="Our global port operations"
                width={600}
                height={400}
                className={styles.storyImage}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section section--dark">
        <div className="container">
          <div className={styles.missionGrid}>
            <motion.div
              className={styles.missionCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.missionTitle}>{ta.missionTitle}</h3>
              <p className={styles.missionText}>{ta.missionText}</p>
            </motion.div>

            <motion.div
              className={styles.missionCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.missionTitle}>{ta.visionTitle}</h3>
              <p className={styles.missionText}>{ta.visionText}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{ta.valuesLabel}</span>
            <h2 className="section-heading__title">{ta.valuesTitle}</h2>
            <p className="section-heading__subtitle">{ta.valuesSub}</p>
          </div>

          <div className={styles.valuesGrid}>
            {ta.values.map((value, idx) => (
              <motion.div
                key={value.title}
                className={styles.valueCard}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.valueNumber}>0{idx + 1}</div>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueDesc}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section section--light">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{ta.timelineLabel}</span>
            <h2 className="section-heading__title">{ta.timelineTitle}</h2>
            <p className="section-heading__subtitle">{ta.timelineSub}</p>
          </div>

          <div className={styles.timelineWrapper}>
            <div className={styles.timelineLine} />
            {ta.timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                className={`${styles.timelineNode} ${idx % 2 === 0 ? styles.nodeLeft : styles.nodeRight}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.nodeDot} />
                <div className={styles.nodeCard}>
                  <div className={styles.nodeYear}>{item.year}</div>
                  <h4 className={styles.nodeTitle}>{item.title}</h4>
                  <p className={styles.nodeDesc}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section--dark" style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading__title" style={{ color: "var(--color-white)", marginBottom: "var(--space-4)" }}>
              {ta.ctaTitle}
            </h2>
            <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
              {ta.ctaSub}
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/request-quote" className="btn btn-primary btn-lg">
                {ta.requestFreeQuote} <MdArrowForward style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                {ta.contactUs}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
