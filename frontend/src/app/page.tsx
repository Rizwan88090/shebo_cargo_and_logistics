"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  MdFlight,
  MdDirectionsBoat,
  MdLocalShipping,
  MdHome,
  MdBusiness,
  MdDirectionsCar,
  MdWarehouse,
  MdStar,
  MdArrowForward,
  MdCheckCircle,
} from "react-icons/md";
import { services } from "@/data/services";
import { countries } from "@/data/countries";
import { reviews } from "@/data/reviews";
import { faqs } from "@/data/faq";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/config/i18n";
import Tilt3D from "@/components/ui/Tilt3D";
import styles from "./page.module.css";

const iconMap: Record<string, React.ReactNode> = {
  MdFlight: <MdFlight />,
  MdDirectionsBoat: <MdDirectionsBoat />,
  MdLocalShipping: <MdLocalShipping />,
  MdHome: <MdHome />,
  MdBusiness: <MdBusiness />,
  MdDirectionsCar: <MdDirectionsCar />,
  MdWarehouse: <MdWarehouse />,
};

/* Deterministic particle field (no random → no hydration mismatch) */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 6.3 + 4) % 100}%`,
  dur: `${8 + (i % 6) * 2.2}s`,
  delay: `${(i % 8) * 1.2}s`,
}));

/* ——— Animated Counter ——— */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ——— FAQ Accordion Item ——— */
function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className={styles.faqIcon}>{open ? "−" : "+"}</span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ""}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

/* ——— HOME PAGE ——— */
export default function HomePage() {
  const { t, locale } = useLanguage();

  const getStatLabel = (label: string) => {
    if (label === "Years of Experience") return t.home.statsLabels.experience;
    if (label === "Countries Served") return t.home.statsLabels.countries;
    if (label === "Happy Clients") return t.home.statsLabels.clients;
    if (label === "Shipments Delivered") return t.home.statsLabels.shipments;
    return label;
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <Image
            src="/images/hero-bg.png"
            alt="Global cargo logistics"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* Glowing floating orbs */}
        <div className={styles.heroDecor} aria-hidden="true">
          <span className={styles.orb1} />
          <span className={styles.orb2} />
          <span className={styles.orb3} />
        </div>

        {/* Rising particles */}
        <div className={styles.particles} aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay }}
            />
          ))}
        </div>

        {/* 3D rotating rings */}
        <div className={styles.heroRings} aria-hidden="true">
          <span className={`${styles.ring} ${styles.ring1}`} />
          <span className={`${styles.ring} ${styles.ring2}`} />
          <span className={`${styles.ring} ${styles.ring3}`} />
        </div>

        {/* Floating 3D cube */}
        <div className={styles.cubeScene} aria-hidden="true">
          <div className={styles.cube}>
            <span className={`${styles.cubeFace} ${styles.cubeFront}`}>AIR</span>
            <span className={`${styles.cubeFace} ${styles.cubeBack}`}>SEA</span>
            <span className={`${styles.cubeFace} ${styles.cubeRight}`}>LAND</span>
            <span className={`${styles.cubeFace} ${styles.cubeLeft}`}>MOV</span>
            <span className={`${styles.cubeFace} ${styles.cubeTop}`} />
            <span className={`${styles.cubeFace} ${styles.cubeBottom}`} />
          </div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.heroBadge}>
              {t.home.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.home.heroTitle}
            <br />
            <span className="display-italic">{t.home.heroTitleHighlight}</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/request-quote" className="btn btn-primary btn-lg">
              {t.home.getFreeQuote} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
            </Link>
            <Link href="/services" className="btn btn-secondary btn-lg">
              {t.home.ourServices}
            </Link>
          </motion.div>

          {/* 3D cube — mobile only, below the hero buttons */}
          <div className={styles.cubeMobileWrap} aria-hidden="true">
            <div className={styles.cube}>
              <span className={`${styles.cubeFace} ${styles.cubeFront}`}>AIR</span>
              <span className={`${styles.cubeFace} ${styles.cubeBack}`}>SEA</span>
              <span className={`${styles.cubeFace} ${styles.cubeRight}`}>LAND</span>
              <span className={`${styles.cubeFace} ${styles.cubeLeft}`}>MOV</span>
              <span className={`${styles.cubeFace} ${styles.cubeTop}`} />
              <span className={`${styles.cubeFace} ${styles.cubeBottom}`} />
            </div>
          </div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Tilt3D max={8} glare className={styles.heroStats}>
              {siteConfig.stats.map((stat) => (
                <div key={stat.label} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className={styles.heroStatLabel}>{getStatLabel(stat.label)}</span>
                </div>
              ))}
            </Tilt3D>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel} />
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.home.servicesLabel}</span>
            <h2 className="section-heading__title">{t.home.servicesTitle}</h2>
            <p className="section-heading__subtitle">
              {t.home.servicesSubtitle}
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40, rotateX: 14 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Tilt3D glare max={10} style={{ borderRadius: "var(--radius-xl)" }}>
                <Link
                  href={`/services/${service.slug}`}
                  className={styles.serviceCard}
                  id={`service-${service.slug}`}
                >
                  <div className={styles.serviceCardImage}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className={styles.serviceCardOverlay} />
                  </div>
                  <div className={styles.serviceCardContent}>
                    <div className={styles.serviceCardIcon}>
                      {iconMap[service.icon]}
                    </div>
                    <h3 className={styles.serviceCardTitle}>
                      {t.home.serviceTitles[service.slug as keyof typeof t.home.serviceTitles] || service.shortTitle}
                    </h3>
                    <p className={styles.serviceCardDesc}>
                      {t.home.serviceDescs[service.slug as keyof typeof t.home.serviceDescs] || service.shortDescription}
                    </p>
                    <span className={styles.serviceCardLink}>
                      {t.common.learnMore} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
                    </span>
                  </div>
                </Link>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / WHY US SECTION ===== */}
      <section className="section section--dark" id="why-us-section">
        <div className="container">
          <div className={styles.whyUsGrid}>
            <motion.div
              className={styles.whyUsContent}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="section-heading__label">{t.home.whyUsLabel}</span>
              <h2 className={styles.whyUsTitle}>
                {t.home.whyUsTitle}
                <br />
                <span className="display-italic">{t.home.whyUsTitleHighlight}</span>
              </h2>
              <p className={styles.whyUsText}>
                {t.home.whyUsText}
              </p>
              <div className={styles.whyUsFeatures}>
                {t.home.whyUsFeatures.map((feature, index) => (
                  <div key={index} className={styles.whyUsFeature}>
                    <MdCheckCircle className={styles.whyUsCheck} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-primary">
                {t.home.learnMoreAboutUs} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
              </Link>
            </motion.div>

            <motion.div
              className={styles.whyUsStats}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              {siteConfig.stats.map((stat) => (
                <Tilt3D key={stat.label} glare max={16} className={styles.statCard}>
                  <span className={styles.statValue}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className={styles.statLabel}>{getStatLabel(stat.label)}</span>
                </Tilt3D>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== COUNTRIES SECTION ===== */}
      <section className="section" id="countries-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.home.countriesLabel}</span>
            <h2 className="section-heading__title">{t.home.countriesTitle}</h2>
            <p className="section-heading__subtitle">
              {t.home.countriesSubtitle}
            </p>
          </div>

          <div className={styles.countriesGrid}>
            {countries.slice(0, 8).map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Tilt3D max={16} glare className={styles.countryCard}>
                  <span className={styles.countryFlag}>{country.flag}</span>
                  <h4 className={styles.countryName}>
                    {t.home.countryNames[country.code as keyof typeof t.home.countryNames] || country.name}
                  </h4>
                  <p className={styles.countryServices}>
                    {country.services.length} {t.home.nServices}
                  </p>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
          <div className={styles.countriesCta}>
            <Link href="/countries" className="btn btn-outline">
              {t.home.viewAllCountries} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="section section--dark" id="testimonials-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.home.testimonialsLabel}</span>
            <h2 className="section-heading__title">{t.home.testimonialsTitle}</h2>
            <p className="section-heading__subtitle">
              {t.home.testimonialsSubtitle}
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {t.home.testimonialsList.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Tilt3D max={9} glare className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MdStar key={i} className={styles.starFilled} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <strong className={styles.testimonialName}>
                      {testimonial.name}
                    </strong>
                    <span className={styles.testimonialCompany}>
                      {testimonial.company}
                    </span>
                  </div>
                </div>
                <span className={styles.testimonialService}>
                  {testimonial.service}
                </span>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
          <div className={styles.countriesCta}>
            <Link href="/reviews" className="btn btn-secondary">
              {t.home.readAllReviews} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className={styles.ctaSection} id="cta-section">
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.ctaTitle}>
              {t.home.ctaTitle}
            </h2>
            <p className={styles.ctaSubtitle}>
              {t.home.ctaSubtitle}
            </p>
            <div className={styles.ctaActions}>
              <Link href="/request-quote" className="btn btn-primary btn-lg">
                {t.home.requestFreeQuote}
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                {t.home.contactUs}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ PREVIEW SECTION ===== */}
      <section className="section" id="faq-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.home.faqLabel}</span>
            <h2 className="section-heading__title">{t.home.faqTitle}</h2>
            <p className="section-heading__subtitle">
              {t.home.faqSubtitle}
            </p>
          </div>

          <div className={styles.faqGrid}>
            {t.home.faqsList.map((faq, index) => (
              <FaqAccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
          <div className={styles.countriesCta}>
            <Link href="/faq" className="btn btn-outline">
              {t.home.viewAllFaqs} <MdArrowForward style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
