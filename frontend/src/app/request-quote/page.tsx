"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend, MdInfo, MdOutlineCheckCircle, MdPhone, MdCheck } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import styles from "./quote.module.css";

interface Order {
  id: string;
  trackingNumber: string;
  service: string;
  origin: string;
  destination: string;
  status: "pending" | "processing" | "in_transit" | "customs" | "delivered" | "cancelled";
  weight: string;
  dimensions: string;
  cargoType: string;
  estimatedDelivery: string;
  createdAt: string;
  amount: number;
  timeline: { step: string; date: string; completed: boolean }[];
}

function QuoteFormContent() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    origin: "",
    destination: "",
    weight: "",
    dimensions: "",
    cargoType: "",
    notes: "",
  });

  const [finalAgreedPrice, setFinalAgreedPrice] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [estimatedRate, setEstimatedRate] = useState<number>(0);
  const [isRateDiscussed, setIsRateDiscussed] = useState(false);

  // Dispatch Animation States
  const [showDispatch, setShowDispatch] = useState(false);
  const [dispatchStage, setDispatchStage] = useState<"doors" | "engine" | "drive" | "done">("doors");
  const [generatedTracking, setGeneratedTracking] = useState("");

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  // Real-time calculation engine
  useEffect(() => {
    let price = 0;
    const s = formData.service;
    if (!s) {
      setEstimatedRate(0);
      return;
    }

    if (s === "air-cargo") price = 150;
    else if (s === "sea-cargo") price = 400;
    else if (s === "land-cargo") price = 200;
    else if (s === "villa-shifting") price = 1200;
    else if (s === "office-relocation") price = 1800;

    const weightNum = parseFloat(formData.weight.replace(/[^0-9.]/g, "")) || 0;
    if (s === "air-cargo") price += weightNum * 12;
    else if (s === "sea-cargo") price += weightNum * 2.5;
    else if (s === "land-cargo") price += weightNum * 4.5;

    const o = formData.origin.toLowerCase();
    const d = formData.destination.toLowerCase();
    if (o && d) {
      const isDomesticOrigin = o.includes("uae") || o.includes("dubai") || o.includes("abu dhabi");
      const isDomesticDest = d.includes("uae") || d.includes("dubai") || d.includes("abu dhabi");
      if (!isDomesticOrigin || !isDomesticDest) {
        price += 450; // International border premium
      }
    }

    const pkg = formData.cargoType;
    if (pkg === "pallets") price += 150;
    else if (pkg === "loose") price += 50;
    else if (pkg === "other") price += 200;

    setEstimatedRate(Math.round(price));
  }, [formData.service, formData.weight, formData.origin, formData.destination, formData.cargoType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppContact = () => {
    setIsRateDiscussed(true);
    const serviceLabels: Record<string, string> = {
      "air-cargo": "Air Cargo",
      "sea-cargo": "Sea Cargo",
      "land-cargo": "Land Cargo",
      "villa-shifting": "Villa Shifting",
      "office-relocation": "Office Relocation",
      "car-shipping": "Car Shipping",
      "trailer-service": "Trailer Service (GCC)",
      "warehouse-storage": "Warehouse Storage",
    };
    const serviceLabel = serviceLabels[formData.service] || "Cargo Service";

    const msg = `Hello Shebo Cargo! I want to finalize my rate for:
- *Service:* ${serviceLabel}
- *Route:* ${formData.origin || "UAE"} to ${formData.destination || "GCC"}
- *Weight:* ${formData.weight || "Standard"}
- *Estimated rate:* AED ${estimatedRate}
- *My Name:* ${formData.name}`;

    window.open(`https://wa.me/${siteConfig.contact.whatsapp.replace("+", "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Submit Final Booking & Trigger Truck Dispatch
  const handleConfirmAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAgreedPrice) {
      addToast("error", "Rate Required", "Please enter the rate finalized with Shebo agents.");
      return;
    }

    // Step 1: Generate Tracking Number
    const trackNum = `SHB-AE-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newOrderId = `ORD-2024-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedTracking(trackNum);

    // Step 2: Save to LocalStorage for Admin Panel
    const stored = localStorage.getItem("shebo_orders");
    const currentOrders: Order[] = stored ? JSON.parse(stored) : [];
    
    const newOrder: Order = {
      id: newOrderId,
      trackingNumber: trackNum,
      service:
        formData.service === "air-cargo" ? "Air Cargo" :
        formData.service === "sea-cargo" ? "Sea Cargo" :
        formData.service === "land-cargo" ? "Land Cargo" :
        formData.service === "villa-shifting" ? "Villa Shifting" :
        formData.service === "office-relocation" ? "Office Relocation" :
        formData.service === "car-shipping" ? "Car Shipping" :
        formData.service === "trailer-service" ? "Trailer Service" :
        formData.service === "warehouse-storage" ? "Warehouse Storage" : "Cargo Service",
      origin: formData.origin || "Dubai, UAE",
      destination: formData.destination || "Riyadh, KSA",
      status: "pending",
      weight: formData.weight ? `${formData.weight} kg` : "50 kg",
      dimensions: formData.dimensions || "100x100x100 cm",
      cargoType: formData.cargoType || "General Cargo",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      amount: parseFloat(finalAgreedPrice) || estimatedRate,
      timeline: [
        { step: "Order Placed", date: new Date().toLocaleDateString(), completed: true },
        { step: "Picked Up", date: "", completed: false },
        { step: "In Transit", date: "", completed: false },
        { step: "Customs Cleared", date: "", completed: false },
        { step: "Delivered", date: "", completed: false },
      ],
    };

    localStorage.setItem("shebo_orders", JSON.stringify([newOrder, ...currentOrders]));

    // Step 3: Trigger Animation Steps
    setShowDispatch(true);
    setDispatchStage("doors");

    // Timeline for animated stages
    setTimeout(() => {
      setDispatchStage("engine");
    }, 1800); // Door closing animation finishes

    setTimeout(() => {
      setDispatchStage("drive");
    }, 3200); // Engine vibrations complete, truck drives off

    setTimeout(() => {
      setDispatchStage("done");
    }, 5000); // Truck leaves the screen, show success checkmark
  };

  return (
    <div className={styles.containerGrid}>
      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Cargo / Relocation Rate Finalizer</h2>
          <p className={styles.formSubtitle}>
            Complete the form details. Our system generates a dynamic estimate which you can negotiate and lock directly over WhatsApp.
          </p>
        </div>

        {formStatus === "success" ? (
          <div className={styles.successWrapper}>
            <MdOutlineCheckCircle className={styles.successIcon} />
            <h3>Rate Logged Successfully!</h3>
            <p>Your rate of AED {estimatedRate} was calculated. Contact us to schedule cargo pickup.</p>
          </div>
        ) : (
          <form className={styles.quoteForm} onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Contact Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionHeading}>1. Contact Information</h3>
              <div className="grid grid-2" style={{ gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-name">Full Name *</label>
                  <input type="text" name="name" id="quote-name" required placeholder="John Doe" value={formData.name} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-email">Email Address *</label>
                  <input type="email" name="email" id="quote-email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-phone">Phone Number *</label>
                  <input type="tel" name="phone" id="quote-phone" required placeholder="+971 50 123 4567" value={formData.phone} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-company">Company Name (Optional)</label>
                  <input type="text" name="company" id="quote-company" placeholder="Acme Trading LLC" value={formData.company} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* Section 2: Cargo & Shipment Details */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionHeading}>2. Shipment & Cargo Details</h3>
              <div className="grid grid-3" style={{ gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-service">Required Service *</label>
                  <select name="service" id="quote-service" required value={formData.service} onChange={handleChange} className="form-select">
                    <option value="">Select service...</option>
                    <option value="air-cargo">Air Cargo (Express)</option>
                    <option value="sea-cargo">Sea Cargo (Ocean Freight)</option>
                    <option value="land-cargo">Land Cargo (Ground)</option>
                    <option value="villa-shifting">Villa Shifting (Home Move)</option>
                    <option value="office-relocation">Office Relocation</option>
                    <option value="car-shipping">Car Shipping (Worldwide)</option>
                    <option value="trailer-service">Trailer Service (GCC)</option>
                    <option value="warehouse-storage">Warehouse Storage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-origin">Origin (City, Country) *</label>
                  <input type="text" name="origin" id="quote-origin" required placeholder="e.g. Dubai, UAE" value={formData.origin} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-destination">Destination (City, Country) *</label>
                  <input type="text" name="destination" id="quote-destination" required placeholder="e.g. Riyadh, Saudi Arabia" value={formData.destination} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="grid grid-3" style={{ gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-weight">Estimated Weight (kg)</label>
                  <input type="text" name="weight" id="quote-weight" placeholder="e.g. 250" value={formData.weight} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-dimensions">Dimensions / Volume</label>
                  <input type="text" name="dimensions" id="quote-dimensions" placeholder="e.g. 120x80x160 cm" value={formData.dimensions} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-cargotype">Cargo / Packaging Type</label>
                  <select name="cargoType" id="quote-cargotype" value={formData.cargoType} onChange={handleChange} className="form-select">
                    <option value="">Select packaging...</option>
                    <option value="boxes">Boxes / Cartons</option>
                    <option value="pallets">Pallets</option>
                    <option value="furniture">Furniture / Household items</option>
                    <option value="loose">Loose / Unpacked Cargo</option>
                    <option value="other">Specialized / Oversized</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Agreed Price Finalization Panel */}
            {isRateDiscussed && (
              <motion.div 
                className={styles.formSection}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  background: "rgba(212, 168, 83, 0.06)",
                  border: "1px solid rgba(212, 168, 83, 0.25)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  marginTop: "1rem"
                }}
              >
                <h3 className={styles.sectionHeading} style={{ borderBottom: "none", marginBottom: "0.5rem" }}>
                  3. Enter Final Agreed Price
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--color-gray-500)", marginBottom: "1rem" }}>
                  Enter the price finalized with the Shebo agent on WhatsApp to book the dispatch vehicle.
                </p>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Final Agreed Price (AED) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1400" 
                      value={finalAgreedPrice} 
                      onChange={(e) => setFinalAgreedPrice(e.target.value)} 
                      className="form-input" 
                      style={{ border: "1px solid var(--color-gold-500)" }}
                    />
                  </div>
                  <button 
                    onClick={handleConfirmAndDispatch}
                    className="btn btn-primary"
                    style={{ padding: "0.75rem 1.5rem" }}
                  >
                    Lock & Dispatch Order 🚛
                  </button>
                </div>
              </motion.div>
            )}

            <div className={styles.disclaimer}>
              <MdInfo className={styles.disclaimerIcon} />
              <span>
                Calculated estimations are subject to cargo clearance and physical dimensions verification.
              </span>
            </div>
          </form>
        )}
      </div>

      {/* Dynamic Rate Estimator Card */}
      <div className={styles.estimatorCard}>
        <div className={styles.estimatorHeader}>
          <h3 className={styles.estimatorTitle}>Live Rate Estimate</h3>
          <span style={{ fontSize: "0.78rem", color: "var(--color-gold-400)" }}>Powered by Shebo Dispatch Engine</span>
        </div>

        <div className={styles.priceWrapper}>
          <span className={styles.priceLabel}>ESTIMATED FREIGHT VALUE</span>
          {estimatedRate > 0 ? (
            <div className={styles.priceDisplay}>
              AED {estimatedRate.toLocaleString()}.00
            </div>
          ) : (
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", padding: "0.5rem 0" }}>
              Awaiting Input Details
            </div>
          )}
        </div>

        <div className={styles.specList}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Selected Service</span>
            <span className={styles.specValue}>{formData.service ? formData.service.toUpperCase().replace("-", " ") : "None"}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Route Details</span>
            <span className={styles.specValue} style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {formData.origin && formData.destination ? `${formData.origin} ➔ ${formData.destination}` : "Select Route"}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Cargo Weight</span>
            <span className={styles.specValue}>{formData.weight ? `${formData.weight} kg` : "0 kg"}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Packaging Type</span>
            <span className={styles.specValue}>{formData.cargoType ? formData.cargoType.toUpperCase() : "Standard"}</span>
          </div>
        </div>

        {estimatedRate > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button className={styles.whatsappBtn} onClick={handleWhatsAppContact}>
              <FaWhatsapp size={22} /> Negotiate & Finalize Rate
            </button>
            <span style={{ display: "block", textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: "0.75rem" }}>
              1. Negotiate the rate on WhatsApp.<br />2. Submit the finalized price here to dispatch your truck.
            </span>
          </motion.div>
        )}
      </div>

      {/* Truck Dispatch Animation Modal */}
      <AnimatePresence>
        {showDispatch && (
          <div className={styles.dispatchOverlay}>
            <motion.div 
              className={styles.dispatchCard}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>
                SHEBO LOGISTICS DEPOT
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.88rem" }}>
                Preparing truck shipment cargo container for immediate dispatch.
              </p>

              {/* Viewport showing road and truck */}
              <div className={styles.animationViewport}>
                {/* Speed lines */}
                {dispatchStage === "drive" && (
                  <>
                    <div className={`${styles.speedLine} ${styles.speedLine1}`}></div>
                    <div className={`${styles.speedLine} ${styles.speedLine2}`}></div>
                    <div className={`${styles.speedLine} ${styles.speedLine3}`}></div>
                  </>
                )}

                {/* Road */}
                <div className={`${styles.road} ${dispatchStage === "drive" ? styles.roadAnimate : ""}`}>
                  <div className={styles.roadLines}></div>
                </div>

                {/* Styled Truck */}
                <div className={`
                  ${styles.truck} 
                  ${dispatchStage === "engine" ? styles.truckVibrate : ""} 
                  ${dispatchStage === "drive" ? styles.truckDriveAway : ""}
                `}>
                  {/* Trailer */}
                  <div className={styles.trailer}>
                    <span className={styles.logoText}>SHEBO CARGO</span>
                    
                    {/* Trailer Doors */}
                    <div className={styles.doorContainer}>
                      <div className={`${styles.doorLeft} ${dispatchStage !== "doors" ? styles.doorClosedLeft : ""}`}>
                        <div className={styles.lockBar}></div>
                      </div>
                      <div className={`${styles.doorRight} ${dispatchStage !== "doors" ? styles.doorClosedRight : ""}`}>
                        <div className={styles.lockBar}></div>
                      </div>
                    </div>
                  </div>

                  {/* Cabin */}
                  <div className={styles.cabin}>
                    <div className={styles.window}></div>
                    <div className={styles.headlight}></div>
                  </div>

                  {/* Wheels */}
                  <div className={`${styles.wheel} ${styles.wheel1} ${dispatchStage === "drive" ? styles.wheelSpin : ""}`}>
                    <div className={styles.wheelInner}></div>
                  </div>
                  <div className={`${styles.wheel} ${styles.wheel2} ${dispatchStage === "drive" ? styles.wheelSpin : ""}`}>
                    <div className={styles.wheelInner}></div>
                  </div>
                  <div className={`${styles.wheel} ${styles.wheel3} ${dispatchStage === "drive" ? styles.wheelSpin : ""}`}>
                    <div className={styles.wheelInner}></div>
                  </div>
                </div>
              </div>

              {/* Status Labels */}
              <div className={styles.statusLabel}>
                {dispatchStage === "doors" && "🔒 Locking Cargo Trailer Doors..."}
                {dispatchStage === "engine" && "⚡ Ignition Started. Revving Engine..."}
                {dispatchStage === "drive" && "🚚 Truck Dispatched & En Route!"}
                {dispatchStage === "done" && "🎉 Shipment Registered successfully!"}
              </div>

              <div className={styles.subLabel}>
                {dispatchStage === "doors" && "Securing and latching container door bars."}
                {dispatchStage === "engine" && "Calibrating suspension weight factors."}
                {dispatchStage === "drive" && "Departing from Jebel Ali Depot to your destination."}
                {dispatchStage === "done" && "Order logged into administrative databases."}
              </div>

              {dispatchStage === "done" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div style={{ display: "inline-flex", padding: "1rem", background: "rgba(16, 185, 129, 0.15)", borderRadius: "50%", color: "#10b981", fontSize: "2rem", marginBottom: "1rem" }}>
                    <MdCheck />
                  </div>
                  <h4 style={{ color: "#10b981", fontWeight: 700 }}>Tracking Number: {generatedTracking}</h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)", margin: "0.5rem 0 1.5rem" }}>
                    Agreed price of <strong>AED {parseFloat(finalAgreedPrice).toLocaleString()}</strong> locked into contract database.
                  </p>
                  <button 
                    onClick={() => { setShowDispatch(false); setFormStatus("success"); }}
                    className="btn btn-primary"
                    style={{ padding: "0.6rem 2rem", borderRadius: "9999px" }}
                  >
                    Finish & View Receipt
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__content container">
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Request a Quote
          </motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Calculate dynamic rates for domestic or international routes in real-time, then finalize your booking on WhatsApp.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Request Quote</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Suspense fallback={<div>Loading Quote Estimator...</div>}>
            <QuoteFormContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
