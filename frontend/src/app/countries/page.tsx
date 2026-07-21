"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import { countries } from "@/data/countries";
import styles from "./countries.module.css";

export default function CountriesPage() {
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
            Countries We Serve
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            With major shipping routes and global logistical hubs, we deliver seamless transit to over 50 countries.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Countries</span>
          </div>
        </div>
      </section>

      {/* Grid of Countries */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Global Network</span>
            <h2 className="section-heading__title">Our Destinations</h2>
            <p className="section-heading__subtitle">
              We offer full air, sea, and land cargo transport services to a wide variety of domestic and international locations.
            </p>
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
                  <h3 className={styles.name}>{country.name}</h3>
                </div>
                <p className={styles.description}>{country.description}</p>

                <div className={styles.servicesSection}>
                  <h4 className={styles.servicesTitle}>Services Available:</h4>
                  <div className={styles.servicesList}>
                    {country.services.map((service) => (
                      <div key={service} className={styles.serviceTag}>
                        <MdCheckCircle className={styles.checkIcon} />
                        <span>{service}</span>
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
              Shipping to another destination?
            </h2>
            <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
              We regularly customize shipping paths to cover countries beyond our primary locations. Let us know your requirements.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/request-quote" className="btn btn-primary btn-lg">
                Inquire Special Route <MdArrowForward />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                Contact Office
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
