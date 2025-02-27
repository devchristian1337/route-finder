import { useEffect, useState } from "react";
import {
  Theme,
  ThemeProviderContext,
  ThemeProviderState,
} from "./ThemeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  forceReset?: boolean;
};

// Helper function to get current system theme
const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "light"; // Default to light during SSR
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Helper function to clear the theme from localStorage
const clearStoredTheme = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("theme");
  } catch (e) {
    console.error("Failed to clear theme from localStorage:", e);
  }
};

// Helper function to get the theme from localStorage or fallback to default
const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    // Only return valid theme values
    if (
      storedTheme === "dark" ||
      storedTheme === "light" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }

    return null;
  } catch (e) {
    console.error("Failed to read theme from localStorage:", e);
    return null;
  }
};

// Force set the theme in localStorage
const forceSetStoredTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.error("Failed to write theme to localStorage:", e);
  }
};

// Apply the theme class early, before React hydration
const initializeTheme = (forceReset: boolean = false) => {
  if (typeof window === "undefined") return "system";

  try {
    const root = window.document.documentElement;

    // Clear localStorage and use system theme if forceReset is true
    if (forceReset) {
      clearStoredTheme();

      // Apply system theme to document
      const systemThemeValue = getSystemTheme();
      root.classList.remove("light", "dark");
      root.classList.add(systemThemeValue);

      return "system";
    }

    // Get theme from localStorage or use system as default
    const storedTheme = getStoredTheme();
    const initialTheme = storedTheme || "system";

    // Set the theme in localStorage if not already set
    if (!storedTheme) {
      forceSetStoredTheme("system");
    }

    // Resolve and apply the actual theme class
    const resolvedTheme =
      initialTheme === "system" ? getSystemTheme() : initialTheme;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    return initialTheme;
  } catch (e) {
    console.error("Failed to initialize theme:", e);
    return "system";
  }
};

// This should always run directly when the file is loaded
// We want to ensure we force reset when localStorage has no theme
const initialTheme =
  typeof window !== "undefined" ? initializeTheme(!getStoredTheme()) : "system";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  forceReset = false,
}: ThemeProviderProps) {
  // Use a function to initialize state with the accurate theme
  const [theme, setTheme] = useState<Theme>(() => {
    // For SSR, use the default theme
    if (typeof window === "undefined") return defaultTheme;

    // Reset to system theme if forceReset is true
    if (forceReset) {
      clearStoredTheme();
      return "system";
    }

    // Get theme from localStorage if available
    const storedTheme = getStoredTheme();

    // If we have a stored theme, use it
    if (storedTheme) {
      return storedTheme;
    }

    // If no stored theme found, use defaultTheme (which should be "system")
    return defaultTheme;
  });

  // Function to reset theme to system
  const resetTheme = () => {
    clearStoredTheme();
    setTheme("system");
  };

  // Apply theme when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove("light", "dark");

    // Calculate the actual theme to display
    const newResolvedTheme =
      theme === "system" ? getSystemTheme() : (theme as "dark" | "light");

    // Save theme preference to localStorage
    forceSetStoredTheme(theme);

    // Apply theme to DOM
    root.classList.add(newResolvedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        const newResolvedTheme = getSystemTheme();

        root.classList.remove("light", "dark");
        root.classList.add(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Force reset to system theme on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (forceReset) {
      resetTheme();
    }
  }, [forceReset]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    resetTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
