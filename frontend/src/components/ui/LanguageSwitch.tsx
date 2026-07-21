"use client";

import { useLanguage } from "@/config/i18n";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      className={styles.switch}
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      aria-label="Switch language"
      title={locale === "en" ? "العربية" : "English"}
      id="language-switch"
    >
      <span className={`${styles.option} ${locale === "en" ? styles.active : ""}`}>EN</span>
      <span className={styles.divider} />
      <span className={`${styles.option} ${locale === "ar" ? styles.active : ""}`}>AR</span>
    </button>
  );
}
