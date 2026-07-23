"use client";

import { createContext, useContext, useEffect, useCallback, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dark mode is disabled — the site always runs in bright (light) mode.
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    // Clear any previously-saved dark preference so it never comes back.
    try {
      localStorage.removeItem("shebo-theme");
    } catch {
      /* ignore */
    }
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <ThemeContext value={{ theme: "light", setTheme: noop, toggleTheme: noop }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
