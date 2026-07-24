"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdSend } from "react-icons/md";
import { siteConfig } from "@/config/site";
import { sendMessage } from "@/lib/messages";
import styles from "./contact.module.css";

export default function ContactPage() {
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
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
            Contact Us
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get in touch with our team for general inquiries, service feedback, or specific custom shipments.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
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
              <h2 className={styles.sectionTitle}>Get In Touch</h2>
              <p className={styles.sectionDesc}>
                Whether you are a regular cargo shipping customer or looking for moving support, drop us a line. We are here to help.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdPhone />
                  </div>
                  <div>
                    <h4>Phone Number</h4>
                    <a href={`tel:${siteConfig.contact.phone}`} className={styles.infoLink}>
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdEmail />
                  </div>
                  <div>
                    <h4>Email Address</h4>
                    <a href={`mailto:${siteConfig.contact.email}`} className={styles.infoLink}>
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdLocationOn />
                  </div>
                  <div>
                    <h4>Office Address</h4>
                    <p className={styles.infoText}>{siteConfig.contact.address}</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.iconWrapper}>
                    <MdAccessTime />
                  </div>
                  <div>
                    <h4>Office Hours</h4>
                    <p className={styles.infoText}>Monday — Saturday: 8:00 AM — 6:00 PM</p>
                    <p className={styles.infoText}>Sunday: Closed</p>
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
                <h3 className={styles.formTitle}>Send Us a Message</h3>
                {formStatus === "success" ? (
                  <div className={styles.successMessage}>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for reaching out. A cargo operations manager will contact you shortly.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setFormStatus("idle")}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-2" style={{ gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-email">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="contact-email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-phone">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="contact-phone"
                          placeholder="+971 50 000 0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-service">
                        Service of Interest
                      </label>
                      <select
                        name="service"
                        id="contact-service"
                        value={formData.service}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select a service...</option>
                        <option value="air-cargo">Air Cargo</option>
                        <option value="sea-cargo">Sea Cargo</option>
                        <option value="land-cargo">Land Cargo</option>
                        <option value="villa-shifting">Villa Shifting</option>
                        <option value="office-relocation">Office Relocation</option>
                        <option value="car-shipping">Car Shipping</option>
                        <option value="trailer-service">Trailer Service (GCC)</option>
                        <option value="warehouse-storage">Warehouse Storage</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-message">
                        Message / Query *
                      </label>
                      <textarea
                        name="message"
                        id="contact-message"
                        required
                        placeholder="Please describe your cargo requirements or specific questions..."
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
                      {formStatus === "submitting" ? "Sending..." : "Submit Message"} <MdSend />
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
            <span className="section-heading__label">Location</span>
            <h2 className="section-heading__title">Visit Our Headquarters</h2>
            <p className="section-heading__subtitle">
              We are located in the heart of Dubai&apos;s logistics center. Feel free to visit our office for direct cargo bookings.
            </p>
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
