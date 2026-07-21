"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdArrowForward } from "react-icons/md";
import { faqs, faqCategories } from "@/data/faq";
import styles from "./faq.module.css";

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className={styles.faqIcon}>{open ? "−" : "+"}</span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ""}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

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
            FAQ
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Got questions? We have answers. Explore our comprehensive frequently asked questions.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>FAQ</span>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="section">
        <div className="container">
          <div className={styles.faqLayout}>
            {/* Search and Category filters */}
            <div className={styles.filterSidebar}>
              {/* Search Box */}
              <div className={styles.searchBox}>
                <MdSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  id="faq-search-input"
                />
              </div>

              {/* Category selector */}
              <div className={styles.categoriesCard}>
                <h3 className={styles.sidebarTitle}>Categories</h3>
                <div className={styles.categoryBtns}>
                  <button
                    className={`${styles.categoryBtn} ${
                      activeCategory === "All" ? styles.categoryBtnActive : ""
                    }`}
                    onClick={() => setActiveCategory("All")}
                  >
                    All Questions
                  </button>
                  {faqCategories.map((category) => (
                    <button
                      key={category}
                      className={`${styles.categoryBtn} ${
                        activeCategory === category ? styles.categoryBtnActive : ""
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Accordion List */}
            <div className={styles.listColumn}>
              <h2 className={styles.listHeading}>
                {activeCategory} FAQs ({filteredFaqs.length})
              </h2>

              <div className={styles.faqGrid}>
                {filteredFaqs.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {filteredFaqs.map((faq) => (
                      <motion.div
                        key={faq.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaqAccordionItem question={faq.question} answer={faq.answer} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className={styles.noResults}>
                    <h3>No matching FAQs found.</h3>
                    <p>Try refining your search keyword or checking other categories.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="section section--dark" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="section-heading__title" style={{ color: "var(--color-white)" }}>
            Have a Different Question?
          </h2>
          <p className="section-heading__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "var(--space-8)" }}>
            Our customer service specialists are online 24/7 to answer any custom inquiries.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Support <MdArrowForward />
            </Link>
            <Link href="/request-quote" className="btn btn-secondary btn-lg">
              Request a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
