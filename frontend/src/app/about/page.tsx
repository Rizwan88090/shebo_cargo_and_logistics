"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import { siteConfig } from "@/config/site";
import styles from "./about.module.css";

const values = [
  {
    title: "Reliability",
    desc: "We deliver on our promises. Your cargo is handled with utmost security and timeliness.",
  },
  {
    title: "Efficiency",
    desc: "Optimized routes and streamlined customs procedures ensure maximum speed and cost efficiency.",
  },
  {
    title: "Customer Centricity",
    desc: "Tailored logistics solutions and dedicated 24/7 customer support to make shipping hassle-free.",
  },
  {
    title: "Safety First",
    desc: "Comprehensive cargo protection, modern GPS-tracked fleets, and fully insured operations.",
  },
];

const timeline = [
  { year: "2011", title: "Company Founded", desc: "Started with a single truck and local delivery services in Dubai." },
  { year: "2015", title: "GCC Expansion", desc: "Extended services to Oman, Saudi Arabia, and Kuwait with cross-border land shipping." },
  { year: "2019", title: "Global Air & Sea Hub", desc: "Partnered with top airlines and container carriers to launch global sea and air cargo." },
  { year: "2023", title: "Digital Logistics", desc: "Launched smart GPS tracking and advanced customer quote portals." },
];

export default function AboutPage() {
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
            About Us
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Learn more about Shebo Cargo & Logistics and our journey to becoming a global logistics leader.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About</span>
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
                <span className="section-heading__label" style={{ justifyContent: "flex-start" }}>Our Story</span>
                <h2 className="section-heading__title" style={{ textAlign: "left" }}>Fifteen Years of Logistics Excellence</h2>
              </div>
              <p className={styles.paragraph}>
                At Shebo Cargo & Logistics, we started with a simple vision: to make cargo transportation reliable, efficient, and stress-free. Over the last 15 years, we have grown from a small local delivery service to an international freight forwarding and relocation powerhouse.
              </p>
              <p className={styles.paragraph}>
                Today, our global logistics network spans over 50 countries, facilitating seamless trade and relocation services for businesses and individuals alike. Our team of experienced logistics professionals and state-of-the-art tracking systems guarantee that your cargo is always in safe hands.
              </p>
              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>Licensed and fully insured operations</span>
                </div>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>24/7 dedicated customer care and support</span>
                </div>
                <div className={styles.bulletItem}>
                  <MdCheckCircle className={styles.bulletIcon} />
                  <span>Customs clearance experts at all major ports</span>
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
              <h3 className={styles.missionTitle}>Our Mission</h3>
              <p className={styles.missionText}>
                To connect businesses and communities globally by delivering fast, secure, and cost-effective logistics and relocation services. We aim to exceed expectations through our operations, integrity, and dedication to excellence.
              </p>
            </motion.div>

            <motion.div
              className={styles.missionCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.missionTitle}>Our Vision</h3>
              <p className={styles.missionText}>
                To be recognized as the world&apos;s most reliable and innovative cargo and logistics partner, driving sustainable growth and providing seamless supply chain experiences for our customers worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Values</span>
            <h2 className="section-heading__title">Our Core Values</h2>
            <p className="section-heading__subtitle">
              The fundamental principles that guide our business operations, decisions, and relationships daily.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((value, idx) => (
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
            <span className="section-heading__label">Timeline</span>
            <h2 className="section-heading__title">Our Journey So Far</h2>
            <p className="section-heading__subtitle">
              Take a quick look at the milestones that shaped Shebo Cargo & Logistics over the years.
            </p>
          </div>

          <div className={styles.timelineWrapper}>
            <div className={styles.timelineLine} />
            {timeline.map((item, idx) => (
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
              Need Help With Shipping or Moving?
            </h2>
            <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
              Get in touch with our team today and let us handle your logistical challenge with ease.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/request-quote" className="btn btn-primary btn-lg">
                Request a Free Quote <MdArrowForward />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
