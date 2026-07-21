"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdArrowForward, MdAccessTime, MdPerson } from "react-icons/md";
import { blogPosts, type BlogPost } from "@/data/blog";
import { useLanguage } from "@/config/i18n";
import styles from "./blog.module.css";

const categories: ("All" | BlogPost["category"])[] = ["All", "Shipping", "Moving", "Corporate", "Tips"];

export default function BlogPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | BlogPost["category"]>("All");

  const filtered = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPosts = blogPosts.slice(0, 3);

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
            {t.blog.title}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.blog.subtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{t.nav.home}</Link>
            <span>/</span>
            <span>{t.nav.blog}</span>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="section section--light">
        <div className="container">
          {/* Controls: Search and Filters */}
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <MdSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t.blog.searchPlaceholder}
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.categoryFilters}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "All" ? t.common.all : cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.layout}>
            {/* Main Listing Column */}
            <div>
              {filtered.length === 0 ? (
                <div className="empty-state" style={{ background: "#fff", borderRadius: "1rem", padding: "4rem 2rem" }}>
                  <div className="empty-state__icon">📰</div>
                  <p className="empty-state__title">{t.blog.noPosts}</p>
                </div>
              ) : (
                <motion.div layout className={styles.blogGrid}>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((post) => (
                      <motion.article
                        key={post.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={styles.postCard}
                      >
                        <div className={styles.cardImageWrapper}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className={styles.cardImage}
                          />
                          <span className={styles.categoryTag}>{post.category}</span>
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.metaRow}>
                            <span className={styles.author}>
                              <MdPerson style={{ verticalAlign: "middle", marginRight: "3px" }} />
                              {post.author}
                            </span>
                            <span>•</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>
                              <MdAccessTime style={{ verticalAlign: "middle", marginRight: "3px" }} />
                              {post.readTime} {t.blog.readTime}
                            </span>
                          </div>
                          <h3 className={styles.title}>{post.title}</h3>
                          <p className={styles.excerpt}>{post.excerpt}</p>
                          <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                            {t.common.readMore} <MdArrowForward />
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className={styles.sidebarColumn}>
              {/* Recent Posts Widget */}
              <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>{t.blog.latestPosts}</h3>
                <div className={styles.widgetList} style={{ marginTop: "1rem" }}>
                  {recentPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className={styles.widgetItem}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={60}
                        height={60}
                        className={styles.widgetItemImage}
                      />
                      <div>
                        <h4 className={styles.widgetItemTitle}>{post.title}</h4>
                        <span style={{ fontSize: "0.7rem", color: "var(--color-gray-400)" }}>{post.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
