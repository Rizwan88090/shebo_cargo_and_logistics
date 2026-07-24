"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { MdFlight, MdDirectionsBoat, MdLocalShipping, MdHome, MdBusiness, MdDirectionsCar, MdWarehouse, MdArrowForward, MdCheckCircle, MdViewDay, MdViewWeek, MdInventory2, MdAcUnit } from "react-icons/md";
import { services } from "@/data/services";
import styles from "./service-detail.module.css";

const iconMap: Record<string, React.ReactNode> = {
  MdFlight: <MdFlight />,
  MdDirectionsBoat: <MdDirectionsBoat />,
  MdLocalShipping: <MdLocalShipping />,
  MdHome: <MdHome />,
  MdBusiness: <MdBusiness />,
  MdDirectionsCar: <MdDirectionsCar />,
  MdWarehouse: <MdWarehouse />,
  MdViewDay: <MdViewDay />,
  MdViewWeek: <MdViewWeek />,
  MdInventory2: <MdInventory2 />,
  MdAcUnit: <MdAcUnit />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const service = services.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__content container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.heroIconWrapper}
          >
            {iconMap[service.icon]}
          </motion.div>
          <motion.h1
            className="page-hero__title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {service.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {service.shortDescription}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/services">Services</Link>
            <span>/</span>
            <span>{service.shortTitle}</span>
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="section">
        <div className="container">
          <div className={styles.detailGrid}>
            {/* Description & Features */}
            <motion.div
              className={styles.contentColumn}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Overview</h2>
              <p className={styles.paragraph}>{service.description}</p>

              <h3 className={styles.subsectionTitle}>Key Features & Benefits</h3>
              <div className={styles.featuresGrid}>
                {service.features.map((feature) => (
                  <div key={feature} className={styles.featureItem}>
                    <MdCheckCircle className={styles.featureIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar / Quick Quote */}
            <motion.div
              className={styles.sidebarColumn}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.imageCard}>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={250}
                  className={styles.sidebarImage}
                />
              </div>

              <div className={styles.ctaCard}>
                <h3 className={styles.ctaTitle}>Need {service.shortTitle}?</h3>
                <p className={styles.ctaText}>
                  Get an instant customized rate estimation for your cargo shipping or shifting requirements.
                </p>
                <Link
                  href={`/request-quote?service=${service.slug}`}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  Request a Quote <MdArrowForward />
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline"
                  style={{ width: "100%", marginTop: "var(--space-3)" }}
                >
                  Contact Expert
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trailer Types Section — only for the trailer service */}
      {service.trailerTypes && service.trailerTypes.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="section-heading">
              <span className="section-heading__label">Fleet</span>
              <h2 className="section-heading__title">Our Trailer Types</h2>
              <p className="section-heading__subtitle">
                Whatever you&apos;re moving, we have the right trailer for it — pick the one that fits your cargo.
              </p>
            </div>

            <div className={styles.trailerGrid}>
              {service.trailerTypes.map((type, idx) => (
                <motion.div
                  key={type.name}
                  className={styles.trailerCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.trailerIcon}>{iconMap[type.icon]}</div>
                  <h4 className={styles.trailerName}>{type.name}</h4>
                  <p className={styles.trailerDesc}>{type.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process / How It Works Section */}
      <section className="section section--light">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Process</span>
            <h2 className="section-heading__title">How It Works</h2>
            <p className="section-heading__subtitle">
              Our streamlined step-by-step procedure ensures seamless service execution from start to finish.
            </p>
          </div>

          <div className={styles.processGrid}>
            {service.process.map((step, idx) => (
              <motion.div
                key={step.step}
                className={styles.processCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.stepNum}>0{step.step}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Sub-Navigation CTA */}
      <section className="section section--dark">
        <div className="container">
          <div className={styles.subnavInner}>
            <h3 className={styles.subnavTitle}>Explore Other Services</h3>
            <div className={styles.subnavLinks}>
              {services
                .filter((s) => s.slug !== service.slug)
                .map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className={styles.subnavLink}>
                    {s.shortTitle}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
