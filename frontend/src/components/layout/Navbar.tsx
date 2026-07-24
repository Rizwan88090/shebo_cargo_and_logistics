"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/config/i18n";
import LanguageSwitch from "../ui/LanguageSwitch";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Portal target only exists in the browser — render the drawer after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Don't show public navbar on portal/admin dashboards (they have their own layout)
  if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      id="navbar"
    >
      <div className={`container ${styles.headerInner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="logo">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={46}
            height={46}
            priority
            className={styles.logoImg}
          />
          <div className={styles.logoText}>
            <span className={styles.logoName}>{siteConfig.name.split(" ")[0]}</span>
            <span className={styles.logoTagline}>{t.footer.cargoAndLogistics}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} id="desktop-nav">
          {navigation.map((item) => (
            <div
              key={item.href}
              className={styles.navItem}
              onMouseEnter={() => item.children && setActiveDropdown(item.href)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={`${styles.navLink} ${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? styles.active
                    : ""
                }`}
              >
                {t.nav[item.key as keyof typeof t.nav] || item.label}
                {item.children && <MdKeyboardArrowDown className={styles.dropdownIcon} />}
              </Link>
              {item.children && activeDropdown === item.href && (
                <div className={styles.dropdown}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`${styles.dropdownLink} ${
                        pathname === child.href ? styles.active : ""
                      }`}
                    >
                      {t.nav[child.key as keyof typeof t.nav] || child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + Language/Theme + Mobile Toggle */}
        <div className={styles.headerActions}>
          <div className={styles.desktopControls}>
            <LanguageSwitch />
          </div>
          <Link href="/login" className={`${styles.signIn} ${styles.ctaBtn}`} id="nav-login">
            {t.nav.login}
          </Link>
          <Link href="/request-quote" className={`btn btn-primary btn-sm ${styles.ctaBtn}`} id="nav-cta">
            {t.nav.getQuote}
          </Link>
          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isMobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation — rendered through a portal to <body>.
          It MUST NOT live inside <header>: the header has `backdrop-filter`,
          which on iOS WebKit makes it the containing block for fixed-position
          descendants, so the drawer would size against the ~70px header instead
          of the viewport (only the close icon showed). The portal escapes it. */}
      {mounted &&
        createPortal(
          <>
            <div
              className={`${styles.mobileOverlay} ${isMobileOpen ? styles.mobileOverlayOpen : ""}`}
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <div
              className={`${styles.mobileNav} ${isMobileOpen ? styles.mobileNavOpen : ""}`}
              id="mobile-nav"
            >
              <button
                className={styles.mobileClose}
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <HiX />
              </button>
              <nav className={styles.mobileNavInner}>
                <div className={styles.mobileControls}>
                  <LanguageSwitch />
                </div>
                {navigation.map((item) => (
                  <div key={item.href} className={styles.mobileNavItem}>
                    <Link
                      href={item.href}
                      className={`${styles.mobileNavLink} ${
                        pathname === item.href ? styles.active : ""
                      }`}
                      onClick={() => !item.children && setIsMobileOpen(false)}
                    >
                      {t.nav[item.key as keyof typeof t.nav] || item.label}
                    </Link>
                    {item.children && (
                      <div className={styles.mobileSubmenu}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={styles.mobileSubmenuLink}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {t.nav[child.key as keyof typeof t.nav] || child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  <Link
                    href="/login"
                    className="btn btn-secondary"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/request-quote"
                    className="btn btn-primary"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {t.nav.getQuote}
                  </Link>
                </div>
              </nav>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
