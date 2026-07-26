"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import { countries } from "@/data/countries";
import { countryDescriptionsAr, serviceTagAr } from "@/data/countriesI18n";
import { useLanguage } from "@/config/i18n";
import styles from "./countries.module.css";

export default function CountriesPage() {
  const { t, locale } = useLanguage();
  const tc = t.countriesPage;
  const isAr = locale === "ar";
  const countryNames = t.home.countryNames as Record<string, string>;

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
            {tc.heroTitle}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tc.heroSubtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{tc.home}</Link>
            <span>/</span>
            <span>{tc.countries}</span>
          </div>
        </div>
      </section>

      {/* Grid of Countries */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{tc.networkLabel}</span>
            <h2 className="section-heading__title">{tc.destinationsTitle}</h2>
            <p className="section-heading__subtitle">{tc.destinationsSub}</p>
          </div>

          <div className={styles.countriesGrid}>
            {countries.map((country, idx) => (
              <motion.div
                key={country.code}
                className={styles.countryCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.flag}>{country.flag}</span>
                  <h3 className={styles.name}>{countryNames[country.code] ?? country.name}</h3>
                </div>
                <p className={styles.description}>
                  {isAr ? countryDescriptionsAr[country.code] ?? country.description : country.description}
                </p>

                <div className={styles.servicesSection}>
                  <h4 className={styles.servicesTitle}>{tc.servicesAvailable}</h4>
                  <div className={styles.servicesList}>
                    {country.services.map((service) => (
                      <div key={service} className={styles.serviceTag}>
                        <MdCheckCircle className={styles.checkIcon} />
                        <span>{isAr ? serviceTagAr[service] ?? service : service}</span>
                      </div>
                    ))}
                  </div>
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
              {tc.ctaTitle}
            </h2>
            <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
              {tc.ctaSub}
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/request-quote" className="btn btn-primary btn-lg">
                {tc.inquireRoute} <MdArrowForward style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                {tc.contactOffice}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
