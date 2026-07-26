"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdSend } from "react-icons/md";
import { siteConfig } from "@/config/site";
import { sendMessage } from "@/lib/messages";
import { useLanguage } from "@/config/i18n";
import styles from "./contact.module.css";

export default function ContactPage() {
  const { t } = useLanguage();
  const tc = t.contactPage;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMsg("");

    try {
      // Delivers straight to the admin panel (live) via the backend Messages API.
      await sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        service: formData.service || undefined,
        message: formData.message,
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : tc.genericError);
      setFormStatus("error");
    }
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
            <span>{tc.contact}</span>
          </div>
        </div>
      </section>

      {/* Main Contact Area */}
      <section className="section">
        <div className="container">
          <div className={styles.contactLayout}>
            {/* Contact Information Cards */}
            <motion.div
              className={styles.infoColumn}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.sectionTitle}>{tc.getInTouch}</h2>
              <p className={styles.sectionDesc}>{tc.getInTouchText}</p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdPhone />
                  </div>
                  <div>
                    <h4>{tc.phoneNumber}</h4>
                    <a href={`tel:${siteConfig.contact.phone}`} className={styles.infoLink} dir="ltr">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdEmail />
                  </div>
                  <div>
                    <h4>{tc.emailAddress}</h4>
                    <a href={`mailto:${siteConfig.contact.email}`} className={styles.infoLink} dir="ltr">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdLocationOn />
                  </div>
                  <div>
                    <h4>{tc.officeAddress}</h4>
                    <p className={styles.infoText}>{siteConfig.contact.address}</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdAccessTime />
                  </div>
                  <div>
                    <h4>{tc.officeHours}</h4>
                    <p className={styles.infoText}>{tc.officeHoursWeek}</p>
                    <p className={styles.infoText}>{tc.officeHoursSun}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className={styles.formColumn}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.formContainer}>
                <h3 className={styles.formTitle}>{tc.sendUsMessage}</h3>
                {formStatus === "success" ? (
                  <div className={styles.successMessage}>
                    <h4>{tc.successTitle}</h4>
                    <p>{tc.successText}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setFormStatus("idle")}>
                      {tc.sendAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">
                        {tc.fullNameLabel} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        required
                        placeholder={tc.namePlaceholder}
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-2" style={{ gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-email">
                          {tc.emailLabel} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="contact-email"
                          required
                          placeholder={tc.emailPlaceholder}
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-phone">
                          {tc.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="contact-phone"
                          placeholder={tc.phonePlaceholder}
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-service">
                        {tc.serviceInterest}
                      </label>
                      <select
                        name="service"
                        id="contact-service"
                        value={formData.service}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">{tc.selectService}</option>
                        {tc.serviceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-message">
                        {tc.messageQuery} *
                      </label>
                      <textarea
                        name="message"
                        id="contact-message"
                        required
                        placeholder={tc.messagePlaceholder}
                        value={formData.message}
                        onChange={handleChange}
                        className="form-textarea"
                      />
                    </div>

                    {formStatus === "error" && errorMsg && (
                      <p
                        role="alert"
                        style={{
                          color: "var(--color-error, #dc2626)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      id="contact-submit"
                    >
                      {formStatus === "submitting" ? tc.sending : tc.submit} <MdSend />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className={styles.mapSection} id="map-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{tc.locationLabel}</span>
            <h2 className="section-heading__title">{tc.visitHq}</h2>
            <p className="section-heading__subtitle">{tc.visitHqSub}</p>
          </div>

          <div className={styles.mapWrapper}>
            <iframe
              src={siteConfig.maps.embedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shebo Cargo Headquarters Location Map"
            />
          </div>
        </div>
      </section>
    </>
  );
}
