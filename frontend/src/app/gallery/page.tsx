"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdZoomIn } from "react-icons/md";
import { useLanguage } from "@/config/i18n";
import styles from "./gallery.module.css";

const galleryCategories = ["All", "Freight", "Relocation"];

const galleryItems = [
  {
    id: 1,
    title: "Air Cargo Loading",
    category: "Freight",
    image: "/images/air-cargo.png",
    description: "Express shipping cargo being loaded onto plane safely.",
  },
  {
    id: 2,
    title: "Vessel Ocean Transit",
    category: "Freight",
    image: "/images/sea-cargo.png",
    description: "Massive container ship carrying cargo goods internationally.",
  },
  {
    id: 3,
    title: "Premium Villa Relocation",
    category: "Relocation",
    image: "/images/villa-shifting.png",
    description: "Professional residential move packing & truck shifting.",
  },
  {
    id: 4,
    title: "Corporate Office Shifting",
    category: "Relocation",
    image: "/images/office-relocation.png",
    description: "Systematic office desk and computer infrastructure move.",
  },
  {
    id: 5,
    title: "Land Freight Dispatch",
    category: "Freight",
    image: "/images/land-cargo.png",
    description: "GPS-enabled cargo container trucks departing for GCC transit.",
  },
  {
    id: 6,
    title: "Car Shipping Transporter",
    category: "Freight",
    image: "/images/car-shipping.png",
    description: "Dedicated auto transporter truck loaded with cars, fully branded with Shebo Cargo & Logistics.",
  },
  {
    id: 7,
    title: "Secure Warehouse Facility",
    category: "Relocation",
    image: "/images/warehouse-storage.png",
    description: "High-tech climate-controlled warehouse with 24/7 CCTV and bonded storage facilities.",
  },
  {
    id: 8,
    title: "Global Logistics Hub",
    category: "Freight",
    image: "/images/hero-bg.png",
    description: "Overview of port operations and massive container yard distribution.",
  },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const tg = t.galleryPage;
  const catLabel = (cat: string) =>
    cat === "All" ? tg.catAll : cat === "Freight" ? tg.catFreight : tg.catRelocation;
  const locTitle = (id: number, fallback: string) =>
    tg.items[String(id) as keyof typeof tg.items]?.title ?? fallback;
  const locDesc = (id: number, fallback: string) =>
    tg.items[String(id) as keyof typeof tg.items]?.description ?? fallback;

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
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
            {tg.heroTitle}
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tg.heroSubtitle}
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">{tg.home}</Link>
            <span>/</span>
            <span>{tg.gallery}</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <div className={styles.filterWrapper}>
            {galleryCategories.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${
                  activeCategory === category ? styles.filterBtnActive : ""
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  setLightboxIndex(null);
                }}
              >
                {catLabel(category)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div layout className={styles.galleryGrid}>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={styles.galleryCard}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image}
                      alt={locTitle(item.id, item.title)}
                      width={400}
                      height={280}
                      className={styles.image}
                    />
                    <div className={styles.hoverOverlay}>
                      <MdZoomIn className={styles.zoomIcon} />
                      <h4 className={styles.itemTitle}>{locTitle(item.id, item.title)}</h4>
                      <span className={styles.itemCategory}>{catLabel(item.category)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox / Slideshow Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.lightbox}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              aria-label="Close Lightbox"
            >
              <MdClose />
            </button>

            <div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.navBtn} onClick={prevImage} aria-label="Previous image">
                ❮
              </button>
              <div className={styles.lightboxImageContainer}>
                <Image
                  src={filteredItems[lightboxIndex].image}
                  alt={locTitle(filteredItems[lightboxIndex].id, filteredItems[lightboxIndex].title)}
                  width={800}
                  height={500}
                  className={styles.lightboxImage}
                  style={{ objectFit: "contain" }}
                />
                <div className={styles.lightboxCaption}>
                  <h3>{locTitle(filteredItems[lightboxIndex].id, filteredItems[lightboxIndex].title)}</h3>
                  <p>{locDesc(filteredItems[lightboxIndex].id, filteredItems[lightboxIndex].description)}</p>
                </div>
              </div>
              <button className={styles.navBtn} onClick={nextImage} aria-label="Next image">
                ❯
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
