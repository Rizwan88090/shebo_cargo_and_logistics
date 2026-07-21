"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MdBusiness,
  MdSupervisorAccount,
  MdAttachMoney,
  MdVerifiedUser,
  MdSend,
} from "react-icons/md";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import styles from "./corporate.module.css";

export default function CorporatePage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    volume: "1-10",
    contract: "pay-as-you-go",
    contactName: "",
    email: "",
    phone: "",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      addToast(
        "success",
        "Partnership Request Received!",
        "Our corporate account manager will contact you within 24 business hours."
      );
      setForm({
        companyName: "",
        industry: "",
        volume: "1-10",
        contract: "pay-as-you-go",
        contactName: "",
        email: "",
        phone: "",
        requirements: "",
      });
    }, 1500);
  };

  const benefitIcons = [
    <MdSupervisorAccount />,
    <MdAttachMoney />,
    <MdVerifiedUser />,
    <MdBusiness />
  ];

  const corporateBenefits = t.corporate.benefitsList.map((b, i) => ({
    icon: benefitIcons[i] || <MdSupervisorAccount />,
    title: b.title,
    desc: b.desc
  }));

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
            {t.corporate.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.corporate.subtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{t.nav.home}</Link>
            <span>/</span>
            <span>{t.nav.corporate}</span>
          </div>
        </div>
      </section>

      {/* Main Form and Benefits Info */}
      <section className="section section--light">
        <div className="container">
          <div className={styles.splitLayout}>
            {/* Left: Value Props */}
            <motion.div
              className={styles.infoPanel}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.title}>Enterprise-Grade Global Logistics</h2>
              <p className={styles.intro}>
                Shebo Cargo & Logistics supports businesses with seamless shipping systems, enabling
                corporate partners to automate bookings, track fleets, and lower supply chain overhead.
              </p>

              <div className={styles.benefitsList}>
                {corporateBenefits.map((benefit, i) => (
                  <div key={i} className={styles.benefitItem}>
                    <div className={styles.benefitIcon}>{benefit.icon}</div>
                    <div>
                      <h4 className={styles.benefitTextTitle}>{benefit.title}</h4>
                      <p className={styles.benefitTextDesc}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Registration Form */}
            <motion.div
              className={styles.formPanel}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={styles.formTitle}>{t.corporate.formTitle}</h3>
              <p className={styles.formSubtitle}>
                Tell us about your business shipping volumes to receive custom contract quotes.
              </p>

              <form onSubmit={handleSubmit} className="portal-form">
                <div className="form-group">
                  <label className="form-label">{t.corporate.companyName}</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.corporate.industry}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Retail, Manufacturing"
                      required
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.common.name} (Contact)</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.common.email}</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.common.phone}</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t.corporate.monthlyVolume}</label>
                    <select
                      className="form-select"
                      value={form.volume}
                      onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    >
                      <option value="1-10">1 - 10 shipments / mo</option>
                      <option value="11-50">11 - 50 shipments / mo</option>
                      <option value="51-200">51 - 200 shipments / mo</option>
                      <option value="200+">200+ shipments / mo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.corporate.contractType}</label>
                    <select
                      className="form-select"
                      value={form.contract}
                      onChange={(e) => setForm({ ...form, contract: e.target.value })}
                    >
                      <option value="pay-as-you-go">Pay-As-You-Go</option>
                      <option value="monthly-invoice">Monthly Invoiced Contract</option>
                      <option value="annual-sla">Annual SLA Agreement</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.corporate.requirements}</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide details about cargo types, regular routes, customs requirements..."
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
                  disabled={submitting}
                >
                  {submitting ? (
                    t.common.loading
                  ) : (
                    <>
                      {t.corporate.submitRequest} <MdSend />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
