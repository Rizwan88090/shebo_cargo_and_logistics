"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import { siteConfig } from "@/config/site";
import { createOrder } from "@/lib/orders";
import styles from "./order.module.css";
import truck from "../request-quote/quote.module.css";

const emptyForm = {
  fullName: "",
  phone: "",
  fromCity: "",
  toCity: "",
  cargoType: "",
  notes: "",
};

type Stage = "doors" | "engine" | "drive" | "done";

export default function OrderClient() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Dispatch animation state
  const [showDispatch, setShowDispatch] = useState(false);
  const [stage, setStage] = useState<Stage>("doors");
  const [tracking, setTracking] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const waDigits = siteConfig.contact.whatsapp.replace(/\D/g, "");
  const waLink = `https://wa.me/${waDigits}?text=${encodeURIComponent(
    "Hi Shebo Cargo! I'd like a quote for a shipment.",
  )}`;

  const isFormValid = Boolean(
    form.fullName.trim() &&
      form.phone.trim() &&
      form.fromCity.trim() &&
      form.toCity.trim() &&
      form.cargoType,
  );

  const update =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function closeDispatch() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShowDispatch(false);
    setStage("doors");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) {
      addToast("warning", t.order.validationError);
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        fromCity: form.fromCity.trim(),
        toCity: form.toCity.trim(),
        cargoType: form.cargoType,
        notes: form.notes.trim() || undefined,
      });
      setTracking(order.trackingNumber);
      setForm(emptyForm);
      // Truck dispatch animation → reveals the tracking number
      setStage("doors");
      setShowDispatch(true);
      timers.current = [
        setTimeout(() => setStage("engine"), 1800),
        setTimeout(() => setStage("drive"), 3200),
        setTimeout(() => setStage("done"), 5000),
      ];
    } catch (err) {
      addToast(
        "error",
        "Could not send your request",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero + flow */}
      <section className={styles.hero}>
        <div className="container">
          <span className="eyebrow-pill">{t.order.eyebrow}</span>
          <h1 className={styles.heroTitle}>
            {t.order.heroLead} <span className="display-italic">{t.order.heroAccent}</span>
          </h1>

          {/* Three steps */}
          <div className={styles.steps}>
            {t.order.steps.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <span className={styles.stepNum}>{i + 1}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column flow */}
          <div className={styles.flowGrid}>
            {/* Step 1 — Your details */}
            <div className={`${styles.flowCard} ${styles.confirmCard}`}>
              <span className={styles.stepLabel}>{t.order.step1Label}</span>
              <h2 className={styles.flowTitle}>{t.order.step1Title}</h2>
              <p className={styles.flowText}>{t.order.step1Text}</p>
              <form id="order-form" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <input
                    className="form-input form-input--dark"
                    placeholder={`${t.order.fullName} *`}
                    aria-label={t.order.fullName}
                    value={form.fullName}
                    onChange={update("fullName")}
                  />
                  <input
                    className="form-input form-input--dark"
                    placeholder={`${t.order.phone} *`}
                    aria-label={t.order.phone}
                    value={form.phone}
                    onChange={update("phone")}
                    inputMode="tel"
                  />
                </div>
                <div className={styles.formRow}>
                  <input
                    className="form-input form-input--dark"
                    placeholder={`${t.order.fromCity} *`}
                    aria-label={t.order.fromCity}
                    value={form.fromCity}
                    onChange={update("fromCity")}
                  />
                  <input
                    className="form-input form-input--dark"
                    placeholder={`${t.order.toCity} *`}
                    aria-label={t.order.toCity}
                    value={form.toCity}
                    onChange={update("toCity")}
                  />
                </div>
                <select
                  className="form-select form-select--dark"
                  aria-label={t.order.cargoType}
                  value={form.cargoType}
                  onChange={update("cargoType")}
                >
                  <option value="" disabled>
                    {`${t.order.cargoType} *`}
                  </option>
                  {t.order.cargoTypes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <textarea
                  className="form-textarea form-textarea--dark"
                  placeholder={t.order.notesPlaceholder}
                  aria-label={t.order.notesPlaceholder}
                  value={form.notes}
                  onChange={update("notes")}
                  rows={3}
                />
              </form>
            </div>

            {/* Step 2 — What happens next */}
            <div className={`${styles.flowCard} ${styles.bargainCard}`}>
              <span className={styles.stepLabel}>{t.order.step2Label}</span>
              <h2 className={styles.flowTitle}>{t.order.step2Title}</h2>
              <p className={styles.flowText}>{t.order.step2Text}</p>
              <button
                type="submit"
                form="order-form"
                disabled={submitting}
                className="btn btn-primary btn-block"
              >
                {submitting ? t.order.placing : `${t.order.sendRequest} →`}
              </button>
              <p className={styles.formNote}>{t.order.formNote}</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp btn-block ${styles.waBtn}`}
              >
                <FaWhatsapp /> {t.order.openWhatsApp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Truck dispatch animation → reveals tracking number */}
      <AnimatePresence>
        {showDispatch && (
          <div className={truck.dispatchOverlay}>
            <motion.div
              className={truck.dispatchCard}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff" }}>
                {siteConfig.name.split(" ")[0].toUpperCase()} LOGISTICS DEPOT
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem" }}>
                Sealing your request and dispatching it to our team.
              </p>

              <div className={truck.animationViewport}>
                {stage === "drive" && (
                  <>
                    <div className={`${truck.speedLine} ${truck.speedLine1}`} />
                    <div className={`${truck.speedLine} ${truck.speedLine2}`} />
                    <div className={`${truck.speedLine} ${truck.speedLine3}`} />
                  </>
                )}

                <div className={`${truck.road} ${stage === "drive" ? truck.roadAnimate : ""}`}>
                  <div className={truck.roadLines} />
                </div>

                <div
                  className={`${truck.truck} ${stage === "engine" ? truck.truckVibrate : ""} ${
                    stage === "drive" ? truck.truckDriveAway : ""
                  }`}
                >
                  <div className={truck.trailer}>
                    <span className={truck.logoText}>{siteConfig.name.split(" ")[0].toUpperCase()} CARGO</span>
                    <div className={truck.doorContainer}>
                      <div className={`${truck.doorLeft} ${stage !== "doors" ? truck.doorClosedLeft : ""}`}>
                        <div className={truck.lockBar} />
                      </div>
                      <div className={`${truck.doorRight} ${stage !== "doors" ? truck.doorClosedRight : ""}`}>
                        <div className={truck.lockBar} />
                      </div>
                    </div>
                  </div>
                  <div className={truck.cabin}>
                    <div className={truck.window} />
                    <div className={truck.headlight} />
                  </div>
                  <div className={`${truck.wheel} ${truck.wheel1} ${stage === "drive" ? truck.wheelSpin : ""}`}>
                    <div className={truck.wheelInner} />
                  </div>
                  <div className={`${truck.wheel} ${truck.wheel2} ${stage === "drive" ? truck.wheelSpin : ""}`}>
                    <div className={truck.wheelInner} />
                  </div>
                  <div className={`${truck.wheel} ${truck.wheel3} ${stage === "drive" ? truck.wheelSpin : ""}`}>
                    <div className={truck.wheelInner} />
                  </div>
                </div>
              </div>

              <div className={truck.statusLabel}>
                {stage === "doors" && "🔒 Sealing your shipment request…"}
                {stage === "engine" && "⚡ Ignition started. Revving engine…"}
                {stage === "drive" && "🚚 Request dispatched to our team!"}
                {stage === "done" && "🎉 Request received successfully!"}
              </div>

              <div className={truck.subLabel}>
                {stage === "doors" && "Securing and latching the container door bars."}
                {stage === "engine" && "Warming up the dispatch engine."}
                {stage === "drive" && "Departing from the depot — heading to our coordinators."}
                {stage === "done" && "Our team will contact you shortly to confirm your rate."}
              </div>

              {stage === "done" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "1rem",
                      background: "rgba(16, 185, 129, 0.15)",
                      borderRadius: "50%",
                      color: "#10b981",
                      fontSize: "2rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <MdCheck />
                  </div>
                  <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                    Your tracking number
                  </p>
                  <h4 style={{ color: "#f0d78c", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "0.03em", margin: "0.25rem 0 0.75rem" }}>
                    {tracking}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)", margin: "0 auto 1.5rem", maxWidth: 380 }}>
                    Save this number. Track your shipment&apos;s status anytime once our team confirms your rate.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href={`/tracking?number=${encodeURIComponent(tracking)}`}
                      className="btn btn-primary"
                      style={{ borderRadius: "9999px" }}
                    >
                      Track your shipment
                    </a>
                    <button onClick={closeDispatch} className="btn btn-secondary" style={{ borderRadius: "9999px" }}>
                      Place another request
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
