"use client";

import { useTheme } from "@/config/theme";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      title={theme === "light" ? "Dark Mode" : "Light Mode"}
      id="theme-toggle"
    >
      <span className={`${styles.icon} ${theme === "light" ? styles.active : ""}`}>
        <MdLightMode />
      </span>
      <span className={`${styles.icon} ${theme === "dark" ? styles.active : ""}`}>
        <MdDarkMode />
      </span>
    </button>
  );
}
