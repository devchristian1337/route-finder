import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  forceReset?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resetTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to get current system theme
const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "light";
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

    // Force reset theme to system if requested
    if (forceReset) {
      clearStoredTheme();

      // Apply system theme to document
      const systemThemeValue = getSystemTheme();
      root.classList.remove("light", "dark");
      root.classList.add(systemThemeValue);

      // Save system theme to localStorage
      forceSetStoredTheme("system");

      return "system";
    }

    // Get theme from localStorage or default to system
    const storedTheme = getStoredTheme();
    const initialTheme = storedTheme || "system";

    // Always save the theme to localStorage
    forceSetStoredTheme(initialTheme);

    // Apply the actual theme class to the document
    const resolvedTheme =
      initialTheme === "system"
        ? getSystemTheme()
        : (initialTheme as "dark" | "light");

    // Apply theme class to document
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    return initialTheme;
  } catch (e) {
    console.error("Failed to initialize theme:", e);
    return "system";
  }
};

// Run the initialization immediately on the client side
// Don't force reset to system theme on initial load (changed from true to false)
const initialTheme =
  typeof window !== "undefined" ? initializeTheme(false) : "system";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  forceReset = false,
}: ThemeProviderProps) {
  // Use a function to initialize state with the most accurate theme
  const [theme, setTheme] = useState<Theme>(() => {
    // For SSR, use the default theme
    if (typeof window === "undefined") return defaultTheme;

    // If we're forcing a reset, use system theme
    if (forceReset) {
      clearStoredTheme();
      return "system";
    }

    // Get the theme from localStorage if available
    const storedTheme = getStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

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

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
