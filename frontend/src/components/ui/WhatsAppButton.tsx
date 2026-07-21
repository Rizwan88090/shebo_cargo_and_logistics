"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdClose, MdArrowForward, MdQuestionAnswer } from "react-icons/md";
import { siteConfig } from "@/config/site";
import styles from "./WhatsAppButton.module.css";

const templates = [
  {
    label: "Request a Cargo Quote",
    text: "Hello Shebo Cargo, I would like to request a free quote for cargo shipping/moving services.",
  },
  {
    label: "Track a Shipment",
    text: "Hello Shebo Cargo, I want to inquire about the current status of my cargo shipment.",
  },
  {
    label: "Customer Support help",
    text: "Hello Shebo Cargo, I need assistance regarding my customer account billing details.",
  },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const handleTemplateClick = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${encoded}`, "_blank");
    setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Predefined template assistant panel */}
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              <FaWhatsapp />
            </div>
            <div>
              <h4 className={styles.headerTitle}>WhatsApp Assistant</h4>
              <span className={styles.headerStatus}>Typically replies in minutes</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem", marginLeft: "auto" }}
            >
              <MdClose />
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.chatBubble}>
              Hello! Choose a topic below to chat with our shipping representatives on WhatsApp instantly.
            </div>

            <p className={styles.optionsHeader}>Quick Questions</p>
            <div className={styles.templatesList}>
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  className={styles.templateBtn}
                  onClick={() => handleTemplateClick(tpl.text)}
                >
                  <span>{tpl.label}</span>
                  <MdArrowForward style={{ color: "#25d366" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main floating icon */}
      <button
        onClick={() => setOpen(!open)}
        className={styles.whatsapp}
        aria-label="Chat on WhatsApp"
        id="whatsapp-btn"
      >
        {open ? <MdClose className={styles.closeIcon} /> : <FaWhatsapp />}
      </button>
    </div>
  );
}
