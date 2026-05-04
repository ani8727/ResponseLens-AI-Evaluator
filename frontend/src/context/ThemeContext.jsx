import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext(null);
const THEME_KEY = "theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Apply theme class to root element
  const applyTheme = useCallback((next) => {
    try {
      const root = document.documentElement;
      if (next === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    } catch (e) {
      // ignore (e.g., SSR)
    }
  }, []);

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const initial = stored || "light";
      setTheme(initial);
      applyTheme(initial);
    } catch (e) {
      setTheme("light");
      applyTheme("light");
    }
  }, [applyTheme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        // ignore
      }
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  const setDark = useCallback(() => {
    try {
      localStorage.setItem(THEME_KEY, "dark");
    } catch (e) {}
    applyTheme("dark");
    setTheme("dark");
  }, [applyTheme]);

  const setLight = useCallback(() => {
    try {
      localStorage.setItem(THEME_KEY, "light");
    } catch (e) {}
    applyTheme("light");
    setTheme("light");
  }, [applyTheme]);

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setDark,
    setLight,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeContext;
