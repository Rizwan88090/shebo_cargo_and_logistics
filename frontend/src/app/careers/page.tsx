"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdWork,
  MdLocationOn,
  MdAccessTime,
  MdKeyboardArrowDown,
  MdTrendingUp,
  MdFavorite,
  MdMonetizationOn,
  MdCloudUpload,
  MdClose,
} from "react-icons/md";
import { jobOpenings, type JobOpening } from "@/data/careers";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import styles from "./careers.module.css";

export default function CareersPage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);

  const toggleJob = (id: string) => {
    setOpenJobId(openJobId === id ? null : id);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      addToast("success", "Application Submitted!", `Your application for ${applyJob?.title} has been received.`);
      setApplyJob(null);
      setForm({ name: "", email: "", phone: "", coverLetter: "" });
    }, 1500);
  };

  const benefitIcons = [<MdTrendingUp />, <MdFavorite />, <MdMonetizationOn />];

  const benefits = t.careers.benefitsList.map((b, i) => ({
    icon: benefitIcons[i] || <MdTrendingUp />,
    title: b.title,
    desc: b.desc,
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
            {t.careers.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.careers.subtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{t.nav.home}</Link>
            <span>/</span>
            <span>{t.nav.careers}</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.careers.whyJoin}</span>
            <h2 className="section-heading__title">Why Work With Us?</h2>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className={styles.benefitCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDesc}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="section section--light">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{t.careers.openPositions}</span>
            <h2 className="section-heading__title">Explore Opportunities</h2>
          </div>

          <div className={styles.positionsList}>
            {jobOpenings.map((job, i) => {
              const isOpen = openJobId === job.id;
              return (
                <motion.div
                  key={job.id}
                  className={`${styles.positionCard} ${isOpen ? styles.positionCardOpen : ""}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <button className={styles.positionHeader} onClick={() => toggleJob(job.id)}>
                    <div>
                      <h3 className={styles.positionTitle}>{job.title}</h3>
                      <div className={styles.positionMeta}>
                        <span>
                          <MdWork style={{ marginRight: "3px" }} />
                          {job.department}
                        </span>
                        <span>
                          <MdLocationOn style={{ marginRight: "3px" }} />
                          {job.location}
                        </span>
                        <span>
                          <MdAccessTime style={{ marginRight: "3px" }} />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className={styles.positionTags}>
                      <span className={styles.positionType}>{job.type}</span>
                      <MdKeyboardArrowDown className={styles.arrowIcon} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className={styles.positionDetails}>
                          <h4 className={styles.positionDescTitle}>Description</h4>
                          <p className={styles.positionDesc}>{job.description}</p>

                          <h4 className={styles.positionDescTitle}>Requirements</h4>
                          <ul className={styles.reqList}>
                            {job.requirements.map((req, j) => (
                              <li key={j}>{req}</li>
                            ))}
                          </ul>

                          <button className="btn btn-primary btn-sm" onClick={() => setApplyJob(job)}>
                            {t.careers.applyNow}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {applyJob && (
          <div className="modal-overlay" onClick={() => setApplyJob(null)}>
            <motion.div
              className="modal"
              style={{ maxWidth: "600px" }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal__header">
                <h3 className="modal__title">
                  Apply for {applyJob.title}
                </h3>
                <button className="modal__close" onClick={() => setApplyJob(null)}>
                  <MdClose />
                </button>
              </div>

              <form onSubmit={handleApplySubmit}>
                <div className="modal__body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label">{t.careers.fullName}</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
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
                    <div className="form-group spanFull">
                      <label className="form-label">{t.careers.resume}</label>
                      <div className={styles.uploadArea}>
                        <MdCloudUpload className={styles.uploadIcon} />
                        <p className={styles.uploadText}>
                          <span>Click to upload</span> or drag and drop
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "var(--color-gray-400)", marginTop: "4px" }}>
                          PDF, DOCX, or RTF (max 5MB)
                        </p>
                      </div>
                    </div>
                    <div className="form-group spanFull">
                      <label className="form-label">{t.careers.coverLetter}</label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={form.coverLetter}
                        onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal__footer">
                  <button type="button" className="btn btn--outline" onClick={() => setApplyJob(null)}>
                    {t.common.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? t.common.loading : t.careers.submitApplication}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
