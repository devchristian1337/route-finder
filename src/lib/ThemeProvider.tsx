import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to get current system theme
const getSystemTheme = (): "dark" | "light" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Apply the theme class early, before React hydration
// This script runs immediately when imported
const initializeTheme = () => {
  try {
    const root = window.document.documentElement;
    // Use light as the default theme
    let initialTheme = "light";

    // Check if we have a stored theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      initialTheme = storedTheme;
    } else if (storedTheme === "system" || !storedTheme) {
      // If system preference or no stored preference, use system preference
      initialTheme = getSystemTheme();
    }

    // Apply theme class to document
    root.classList.remove("light", "dark");
    root.classList.add(initialTheme);

    return initialTheme;
  } catch (e) {
    console.error("Failed to initialize theme:", e);
    return "light";
  }
};

// Run the initialization immediately
const initialTheme = initializeTheme();

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  // Start with the theme we already applied to the document
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || defaultTheme
  );

  // Apply theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove("light", "dark");

    // Calculate the actual theme to display
    let newResolvedTheme: "dark" | "light";
    if (theme === "system") {
      newResolvedTheme = getSystemTheme();
    } else {
      newResolvedTheme = theme as "dark" | "light";
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);

    // Apply theme to DOM
    root.classList.add(newResolvedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
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

  const value = {
    theme,
    setTheme,
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
