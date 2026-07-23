"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/config/i18n";
import styles from "./Footer.module.css";

const socialLinks = [
  { icon: <FaInstagram />, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: <FaLinkedinIn />, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: <FaXTwitter />, href: siteConfig.social.twitter, label: "X" },
  { icon: <FaWhatsapp />, href: siteConfig.social.whatsapp, label: "WhatsApp" },
];

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Don't show the public footer on portal/admin dashboards or the auth pages (they have their own layout)
  if (
    pathname.startsWith("/portal") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const companyLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.tracking, href: "/tracking" },
    { label: t.nav.getQuote, href: "/request-quote" },
    { label: t.nav.contact, href: "/contact" },
    { label: t.nav.login, href: "/login" },
  ];

  const serviceLinks = [
    { label: t.footer.serviceLinks.airCargo, href: "/services/air-cargo" },
    { label: t.footer.serviceLinks.seaCargo, href: "/services/sea-cargo" },
    { label: t.footer.serviceLinks.landCargo, href: "/services/land-cargo" },
    { label: t.footer.serviceLinks.villaShifting, href: "/services/villa-shifting" },
    { label: t.footer.serviceLinks.officeRelocation, href: "/services/office-relocation" },
    { label: "Car Shipping", href: "/services/car-shipping" },
    { label: "Trailer Service", href: "/services/trailer-service" },
    { label: "Warehouse Storage", href: "/services/warehouse-storage" },
  ];

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>
                <Image
                  src="/images/logo.png"
                  alt={siteConfig.name}
                  width={42}
                  height={42}
                  className={styles.footerLogoImg}
                />
                <div>
                  <span className={styles.footerBrand}>{siteConfig.name.split(" ")[0]}</span>
                  <span className={styles.footerBrandSub}>{t.footer.cargoAndLogistics}</span>
                </div>
              </div>
              <p className={styles.footerDesc}>{t.footer.description}</p>
              <p className={styles.footerArabic} dir="rtl">{t.footer.arabicTagline}</p>
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>{t.footer.companyTitle}</h4>
              <ul className={styles.footerLinks}>
                {companyLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>{t.footer.ourServicesTitle}</h4>
              <ul className={styles.footerLinks}>
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay in the loop */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>{t.footer.stayUpdated}</h4>
              <p className={styles.newsletterText}>{t.footer.newsletterText}</p>
              <form
                className={styles.newsletterForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={t.footer.yourEmail}
                  className={styles.newsletterInput}
                  id="newsletter-email"
                  aria-label={t.footer.yourEmail}
                />
                <button type="submit" className={styles.newsletterBtn}>
                  {t.footer.join}
                </button>
              </form>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <MdPhone className={styles.contactIcon} />
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>
                    {siteConfig.contact.phone}
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <MdEmail className={styles.contactIcon} />
                  <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                </div>
                <div className={styles.contactItem}>
                  <MdLocationOn className={styles.contactIcon} />
                  <span>{siteConfig.contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomInner}>
            <p>© {new Date().getFullYear()} {siteConfig.name} LLC. {t.footer.rights}</p>
            <div className={styles.footerBottomLinks}>
              <Link href="/faq">{t.footer.privacyPolicy}</Link>
              <Link href="/faq">{t.footer.termsOfService}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
