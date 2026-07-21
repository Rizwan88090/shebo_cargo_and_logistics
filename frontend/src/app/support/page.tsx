"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd,
  MdLabel,
  MdAccessTime,
  MdPriorityHigh,
  MdSend,
  MdClose,
  MdChatBubbleOutline,
  MdPerson,
  MdSupportAgent,
} from "react-icons/md";
import { mockSupportTickets, type SupportTicket } from "@/data/mock/support";
import { useLanguage } from "@/config/i18n";
import { useToast } from "@/components/ui/NotificationToast";
import styles from "./support.module.css";

export default function SupportTicketsPage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "resolved">("all");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // New ticket form fields
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Billing" as SupportTicket["category"],
    priority: "medium" as SupportTicket["priority"],
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return ticket.status === "open" || ticket.status === "in_progress";
    if (activeTab === "resolved") return ticket.status === "resolved" || ticket.status === "closed";
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const createdTicket: SupportTicket = {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        description: newTicket.description,
        replies: [],
      };

      setTickets((prev) => [createdTicket, ...prev]);
      addToast(
        "success",
        "Support Ticket Created!",
        `Your ticket ${createdTicket.id} has been logged in our system.`
      );
      setCreateOpen(false);
      setNewTicket({ subject: "", category: "Billing", priority: "medium", description: "" });
    }, 1200);
  };

  const handleReplySubmit = (ticketId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      sender: "user" as const,
      text: replyText,
      time: new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            replies: [...t.replies, newReply],
            status: t.status === "resolved" ? "open" : t.status, // reopen if resolved
          };
        }
        return t;
      })
    );
    setReplyText("");
    addToast("success", "Reply Posted", "Your message was sent successfully.");

    // Simulate agent auto reply
    setTimeout(() => {
      const agentReply = {
        id: `rep-${Date.now() + 1}`,
        sender: "agent" as const,
        text: "Thank you for the update. Our support technician has been notified and is currently analyzing your request details.",
        time: new Date().toLocaleString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: "in_progress" as const,
              replies: [...t.replies, agentReply],
            };
          }
          return t;
        })
      );
    }, 2000);
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
            {t.support.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.support.subtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{t.nav.home}</Link>
            <span>/</span>
            <span>{t.nav.support}</span>
          </div>
        </div>
      </section>

      {/* Support list column */}
      <section className="section section--light">
        <div className="container">
          <div className={styles.layout}>
            <div>
              {/* Tabs and Actions bar */}
              <div className={styles.ticketTabs}>
                <div className={styles.tabsLeft}>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Tickets ({tickets.length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "open" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("open")}
                  >
                    Active
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "resolved" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("resolved")}
                  >
                    Resolved
                  </button>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
                  <MdAdd /> {t.support.newTicket}
                </button>
              </div>

              {/* Tickets list container */}
              <div className={styles.ticketsList}>
                {filteredTickets.length === 0 ? (
                  <div className="empty-state" style={{ background: "#fff", borderRadius: "1rem", padding: "4rem 2rem" }}>
                    <div className="empty-state__icon">🎟</div>
                    <p className="empty-state__title">{t.support.noTickets}</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => {
                    const isOpen = openTicketId === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        className={`${styles.ticketCard} ${isOpen ? styles.ticketCardOpen : ""}`}
                      >
                        {/* Header accordion row */}
                        <button className={styles.ticketHeader} onClick={() => setOpenTicketId(isOpen ? null : ticket.id)}>
                          <div>
                            <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                            <div className={styles.ticketMeta}>
                              <span style={{ fontWeight: 700, color: "var(--color-gold-600)" }}>
                                {ticket.id}
                              </span>
                              <span>
                                <MdLabel style={{ marginRight: "3px" }} />
                                {ticket.category}
                              </span>
                              <span>
                                <MdAccessTime style={{ marginRight: "3px" }} />
                                {ticket.createdAt}
                              </span>
                              <span>
                                <MdChatBubbleOutline style={{ marginRight: "3px" }} />
                                {ticket.replies.length} messages
                              </span>
                            </div>
                          </div>

                          <div className={styles.ticketBadges}>
                            <span className={`${styles.badge} ${styles[`badgePriority_${ticket.priority}`]}`}>
                              {ticket.priority}
                            </span>
                            <span className={`${styles.badge} ${styles[`badgeStatus_${ticket.status}`]}`}>
                              {ticket.status.replace("_", " ")}
                            </span>
                          </div>
                        </button>

                        {/* Collapsible conversation details */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className={styles.ticketDetails}>
                                <div className={styles.ticketDesc}>
                                  <p style={{ fontWeight: 700, color: "var(--color-navy-800)", marginBottom: "4px" }}>
                                    Initial Problem Description:
                                  </p>
                                  <p>{ticket.description}</p>
                                </div>

                                {/* Replies Feed */}
                                <div className={styles.repliesContainer}>
                                  {ticket.replies.map((reply) => {
                                    const isUser = reply.sender === "user";
                                    return (
                                      <div
                                        key={reply.id}
                                        className={`${styles.replyItem} ${
                                          isUser ? styles.replyUser : styles.replyAgent
                                        }`}
                                      >
                                        <div className={styles.replyHeader}>
                                          <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
                                            {isUser ? <MdPerson /> : <MdSupportAgent />}
                                            {isUser ? "You" : "Support Officer"}
                                          </span>
                                          <span>{reply.time}</span>
                                        </div>
                                        <div className={styles.replyText}>{reply.text}</div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Reply submit block */}
                                <form
                                  onSubmit={(e) => handleReplySubmit(ticket.id, e)}
                                  className={styles.replyForm}
                                >
                                  <textarea
                                    className={styles.replyInput}
                                    placeholder="Type your message to support..."
                                    required
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                  <button type="submit" className="btn btn-primary">
                                    <MdSend />
                                  </button>
                                </form>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Creation Dialog */}
      <AnimatePresence>
        {createOpen && (
          <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
            <motion.div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal__header">
                <h3 className="modal__title">{t.support.newTicket}</h3>
                <button className="modal__close" onClick={() => setCreateOpen(false)}>
                  <MdClose />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="modal__body">
                  <div className="portal-form">
                    <div className="form-group">
                      <label className="form-label">{t.common.subject}</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.support.category}</label>
                        <select
                          className="form-select"
                          value={newTicket.category}
                          onChange={(e) =>
                            setNewTicket({
                              ...newTicket,
                              category: e.target.value as SupportTicket["category"],
                            })
                          }
                        >
                          <option value="Billing">Billing & Invoice</option>
                          <option value="Delivery Delay">Delivery / Shipment Delay</option>
                          <option value="Damaged Cargo">Damaged Cargo Claim</option>
                          <option value="Account Help">Account Management</option>
                          <option value="General Inquiry">General Logistics Inquiry</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t.support.priority}</label>
                        <select
                          className="form-select"
                          value={newTicket.priority}
                          onChange={(e) =>
                            setNewTicket({
                              ...newTicket,
                              priority: e.target.value as SupportTicket["priority"],
                            })
                          }
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.support.description}</label>
                      <textarea
                        className="form-textarea"
                        required
                        rows={4}
                        placeholder="Provide details about shipment numbers, cargo contents, border customs logs..."
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal__footer">
                  <button type="button" className="btn btn--outline" onClick={() => setCreateOpen(false)}>
                    {t.common.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? t.common.loading : t.support.submitTicket}
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
