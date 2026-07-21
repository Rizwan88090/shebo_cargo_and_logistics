"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MdFlightTakeoff,
  MdDirectionsBoat,
  MdLocalShipping,
  MdDirectionsCar,
  MdHome,
  MdBusiness,
  MdAllInbox,
  MdArchive,
  MdWarehouse,
  MdPublic,
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdCheckCircle,
} from "react-icons/md";
import { mockAddresses } from "@/data/mock/addresses";

const SERVICES = [
  { id: "air", name: "Air Cargo", icon: <MdFlightTakeoff />, desc: "Fast delivery, 1–3 days" },
  { id: "sea", name: "Sea Cargo", icon: <MdDirectionsBoat />, desc: "Cost-effective bulk shipping" },
  { id: "land", name: "Land Cargo", icon: <MdLocalShipping />, desc: "GCC road freight" },
  { id: "car", name: "Car Shipping", icon: <MdDirectionsCar />, desc: "Worldwide via car carrier & recovery" },
  { id: "trailer", name: "Trailer Service", icon: <MdLocalShipping />, desc: "GCC — flatbed, curtain, box, reefer" },
  { id: "villa", name: "Villa Shifting", icon: <MdHome />, desc: "Full household moving" },
  { id: "office", name: "Office Relocation", icon: <MdBusiness />, desc: "Corporate moving service" },
  { id: "packing", name: "Packing", icon: <MdAllInbox />, desc: "Professional packaging" },
  { id: "warehousing", name: "Warehouse Storage", icon: <MdWarehouse />, desc: "Secure short & long-term storage" },
  { id: "intl", name: "International Moving", icon: <MdPublic />, desc: "Worldwide door-to-door" },
];

const CARGO_TYPES = ["Electronics", "Furniture", "Machinery", "Household", "Personal Belongings", "Food Items", "Medical Supplies", "Textiles", "Fragile Items", "Documents", "Other"];

const STEPS = ["Service", "Route", "Package", "Review"];

type BookingForm = {
  service: string;
  origin: string;
  originAddr: string;
  destination: string;
  destAddr: string;
  pickupDate: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  cargoType: string;
  description: string;
  insurance: boolean;
  expressHandling: boolean;
};

const defaultForm: BookingForm = {
  service: "",
  origin: "",
  originAddr: "",
  destination: "",
  destAddr: "",
  pickupDate: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  cargoType: "",
  description: "",
  insurance: false,
  expressHandling: false,
};

export default function BookShipmentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BookingForm>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === form.service);

  const basePrice = {
    air: 2000, sea: 4000, land: 1500, villa: 3500, office: 5000,
    packing: 800, warehousing: 1000, intl: 7500,
  }[form.service] || 0;

  const insuranceFee = form.insurance ? Math.round(basePrice * 0.05) : 0;
  const expressFee = form.expressHandling ? 500 : 0;
  const totalEst = basePrice + insuranceFee + expressFee;

  const canProceed = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!(form.origin && form.destination && form.pickupDate);
    if (step === 2) return !!(form.weight && form.cargoType);
    return true;
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "3rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{
            width: 80, height: 80,
            background: "rgba(16,185,129,0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            color: "var(--color-success)",
            margin: "0 auto 1.5rem",
          }}>
            <MdCheckCircle />
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy-800)", margin: "0 0 0.5rem" }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: "var(--color-gray-500)", marginBottom: "2rem" }}>
            Your {selectedService?.name} shipment has been booked. Our team will contact you within 24 hours to confirm pickup.
          </p>
          <div style={{
            background: "var(--color-gray-50)",
            borderRadius: "0.875rem",
            padding: "1.25rem",
            border: "1.5px solid var(--color-gray-200)",
            marginBottom: "1.75rem",
            textAlign: "left",
          }}>
            {[
              { label: "Service", value: selectedService?.name },
              { label: "Route", value: `${form.origin} → ${form.destination}` },
              { label: "Pickup Date", value: form.pickupDate },
              { label: "Estimated Cost", value: `AED ${totalEst.toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-gray-100)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-gray-500)" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: "var(--color-navy-800)" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="btn btn--outline" onClick={() => { setSubmitted(false); setForm(defaultForm); setStep(0); }}>
              Book Another
            </button>
            <Link href="/portal/orders" className="btn btn--primary">View Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Book a Shipment</h1>
        <p className="portal-page__subtitle">Fill in the details below to schedule your cargo pickup.</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`step-item ${i < step ? "completed" : ""} ${i === step ? "active" : ""}`}
          >
            <div className="step-number">
              {i < step ? <MdCheck /> : i + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel__body" style={{ padding: "2rem" }}>

          {/* Step 0 — Service Selection */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy-800)", margin: "0 0 1.25rem" }}>
                Choose a Service
              </h2>
              <div className="service-cards">
                {SERVICES.map((svc) => (
                  <div
                    key={svc.id}
                    className={`service-card ${form.service === svc.id ? "service-card--selected" : ""}`}
                    onClick={() => setForm({ ...form, service: svc.id })}
                  >
                    <div className="service-card__icon">{svc.icon}</div>
                    <div className="service-card__name">{svc.name}</div>
                    <div className="service-card__desc">{svc.desc}</div>
                    {form.service === svc.id && (
                      <div style={{ marginTop: "0.5rem", color: "var(--color-navy-700)", fontSize: "0.8rem", fontWeight: 700 }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Route */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy-800)", margin: "0 0 1.25rem" }}>
                Origin & Destination
              </h2>
              <div className="portal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Origin City / Country</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Dubai, UAE"
                      value={form.origin}
                      onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination City / Country</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Riyadh, Saudi Arabia"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Pickup Address (Optional — choose saved)</label>
                  <select
                    className="form-select"
                    value={form.originAddr}
                    onChange={(e) => setForm({ ...form, originAddr: e.target.value })}
                  >
                    <option value="">Select a saved address or enter manually</option>
                    {mockAddresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.addressLine1}, {a.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Pickup Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.pickupDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Package */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy-800)", margin: "0 0 1.25rem" }}>
                Package Details
              </h2>
              <div className="portal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 50"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cargo Type</label>
                    <select
                      className="form-select"
                      value={form.cargoType}
                      onChange={(e) => setForm({ ...form, cargoType: e.target.value })}
                    >
                      <option value="">Select cargo type</option>
                      {CARGO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  {[
                    { label: "Length (cm)", key: "length" as const },
                    { label: "Width (cm)", key: "width" as const },
                    { label: "Height (cm)", key: "height" as const },
                  ].map((dim) => (
                    <div className="form-group" key={dim.key}>
                      <label className="form-label">{dim.label}</label>
                      <input
                        className="form-input"
                        type="number"
                        placeholder="0"
                        value={form[dim.key]}
                        onChange={(e) => setForm({ ...form, [dim.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Fragile items, temperature sensitive, etc."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { key: "insurance" as const, label: "Add Cargo Insurance (5% of base cost)", desc: "Covers damage or loss during transit" },
                    { key: "expressHandling" as const, label: "Express Handling (+AED 500)", desc: "Priority processing and faster pickup" },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        padding: "0.875rem 1rem",
                        background: form[opt.key] ? "rgba(15,31,54,0.04)" : "var(--color-gray-50)",
                        border: `1.5px solid ${form[opt.key] ? "var(--color-navy-400)" : "var(--color-gray-200)"}`,
                        borderRadius: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form[opt.key]}
                        onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                        style={{ marginTop: "0.2rem", accentColor: "var(--color-navy-700)" }}
                      />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-navy-800)" }}>{opt.label}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-gray-500)", marginTop: "0.15rem" }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy-800)", margin: "0 0 1.25rem" }}>
                Review & Confirm
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                <div className="review-summary">
                  {[
                    { label: "Service", value: selectedService?.name || "—" },
                    { label: "From", value: form.origin || "—" },
                    { label: "To", value: form.destination || "—" },
                    { label: "Pickup Date", value: form.pickupDate || "—" },
                    { label: "Weight", value: form.weight ? `${form.weight} kg` : "—" },
                    { label: "Cargo Type", value: form.cargoType || "—" },
                    { label: "Dimensions", value: form.length && form.width && form.height ? `${form.length} × ${form.width} × ${form.height} cm` : "—" },
                    { label: "Insurance", value: form.insurance ? "Yes" : "No" },
                    { label: "Express Handling", value: form.expressHandling ? "Yes (+AED 500)" : "No" },
                  ].map((row) => (
                    <div className="review-summary__row" key={row.label}>
                      <span className="review-summary__label">{row.label}</span>
                      <span className="review-summary__value">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ background: "var(--color-navy-900)", borderRadius: "0.875rem", padding: "1.25rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                      Estimated Cost
                    </div>
                    {[
                      { label: "Base fare", value: `AED ${basePrice.toLocaleString()}` },
                      ...(form.insurance ? [{ label: "Insurance (5%)", value: `AED ${insuranceFee.toLocaleString()}` }] : []),
                      ...(form.expressHandling ? [{ label: "Express handling", value: "AED 500" }] : []),
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", padding: "0.3rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.875rem", paddingTop: "0.625rem", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                      <span style={{ color: "#fff", fontWeight: 700 }}>Total</span>
                      <span style={{ color: "var(--color-gold-400)", fontWeight: 800, fontSize: "1.15rem" }}>
                        AED {totalEst.toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", margin: "0.75rem 0 0", lineHeight: 1.5 }}>
                      * Final price confirmed after review by our team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="step-nav">
            {step > 0 ? (
              <button className="btn btn--outline" onClick={() => setStep(step - 1)}>
                <MdArrowBack /> Back
              </button>
            ) : (
              <Link href="/portal/dashboard" className="btn btn--outline">
                <MdArrowBack /> Cancel
              </Link>
            )}
            {step < 3 ? (
              <button
                className="btn btn--primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? "pointer" : "not-allowed" }}
              >
                Next Step <MdArrowForward />
              </button>
            ) : (
              <button className="btn btn--gold" onClick={() => setSubmitted(true)}>
                <MdCheck /> Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
