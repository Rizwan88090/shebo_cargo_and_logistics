"use client";

import { useState, useEffect, useCallback } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import { siteConfig } from "@/config/site";
import {
  createOrder,
  listMyOrders,
  ORDERS_UPDATED_EVENT,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import styles from "./order.module.css";

const emptyForm = {
  fullName: "",
  phone: "",
  fromCity: "",
  toCity: "",
  cargoType: "",
  agreedRate: "",
  notes: "",
};

export default function OrderClient() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = useCallback(() => {
    listMyOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(ORDERS_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const waDigits = siteConfig.contact.whatsapp.replace(/\D/g, "");
  const waLink = `https://wa.me/${waDigits}?text=${encodeURIComponent(
    "Hi Meridian, I'd like to agree a rate for a shipment.",
  )}`;

  const update =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.fromCity.trim() ||
      !form.toCity.trim() ||
      !form.cargoType ||
      !form.agreedRate
    ) {
      addToast("warning", t.order.validationError);
      return;
    }
    setSubmitting(true);
    try {
      await createOrder({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        fromCity: form.fromCity.trim(),
        toCity: form.toCity.trim(),
        cargoType: form.cargoType,
        agreedRate: Number(form.agreedRate) || 0,
        notes: form.notes.trim() || undefined,
      });
      addToast("success", t.order.placedToast);
      setForm(emptyForm);
      refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const statusClass: Record<OrderStatus, string> = {
    pending: styles.badgePending,
    processing: styles.badgeProcessing,
    in_transit: styles.badgeInTransit,
    customs: styles.badgeCustoms,
    delivered: styles.badgeDelivered,
    cancelled: styles.badgeCancelled,
  };

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
            {/* Step 1 — Bargain */}
            <div className={`${styles.flowCard} ${styles.bargainCard}`}>
              <span className={styles.stepLabel}>{t.order.step1Label}</span>
              <h2 className={styles.flowTitle}>{t.order.step1Title}</h2>
              <p className={styles.flowText}>{t.order.step1Text}</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp btn-block ${styles.waBtn}`}
              >
                <FaWhatsapp /> {t.order.openWhatsApp}
              </a>
              <a href={`tel:${waDigits}`} className={styles.waPhone}>
                {siteConfig.contact.whatsapp}
              </a>
              <p className={styles.noteBox}>{t.order.step1Note}</p>
            </div>

            {/* Step 2 — Confirm */}
            <div className={`${styles.flowCard} ${styles.confirmCard}`}>
              <span className={styles.stepLabel}>{t.order.step2Label}</span>
              <h2 className={styles.flowTitle}>{t.order.step2Title}</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
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
                <div className={styles.formRow}>
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
                  <div className={styles.rateField}>
                    <input
                      type="number"
                      min="0"
                      className="form-input form-input--dark"
                      placeholder={`${t.order.agreedRate} *`}
                      aria-label={t.order.agreedRate}
                      value={form.agreedRate}
                      onChange={update("agreedRate")}
                    />
                    <span className={styles.rateSuffix}>AED</span>
                  </div>
                </div>
                <textarea
                  className="form-textarea form-textarea--dark"
                  placeholder={t.order.notesPlaceholder}
                  aria-label={t.order.notesPlaceholder}
                  value={form.notes}
                  onChange={update("notes")}
                  rows={3}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                >
                  {submitting ? t.order.placing : `${t.order.placeOrder} →`}
                </button>
                <p className={styles.formNote}>{t.order.formNote}</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* My orders */}
      <section className="section section--cream">
        <div className="container">
          <div className={styles.ordersHead}>
            <h2 className={styles.ordersTitle}>{t.order.myOrders}</h2>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} /> {t.order.liveUpdates}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyCard}>{t.order.emptyOrders}</div>
          ) : (
            <div className={styles.ordersGrid}>
              {orders.map((o) => (
                <div key={o.id} className={styles.orderCard}>
                  <div className={styles.orderCardTop}>
                    <span className={styles.orderNumber}>{o.orderNumber}</span>
                    <span className={`${styles.badge} ${statusClass[o.status]}`}>
                      {t.order.statusLabels[o.status]}
                    </span>
                  </div>
                  <p className={styles.orderRoute}>
                    {o.fromCity} <span className={styles.arrow}>→</span> {o.toCity}
                  </p>
                  <div className={styles.orderMeta}>
                    <span>{o.cargoType}</span>
                    <span className={styles.orderRate}>AED {o.agreedRate.toLocaleString()}</span>
                  </div>
                  <div className={styles.orderFooter}>
                    <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                    <span className={styles.trackNo}>{o.trackingNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
