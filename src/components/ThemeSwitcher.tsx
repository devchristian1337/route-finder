import { cn } from "../lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "../lib/ThemeProvider";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Store the active theme in local state to ensure it's correct after hydration
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  // First render - just show skeleton
  useEffect(() => {
    // On mount, update active theme from the ThemeProvider
    setMounted(true);
    setActiveTheme(theme);
    console.log("ThemeSwitcher mounted with theme:", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    console.log(`Setting theme to ${newTheme}`);
    setTheme(newTheme);
    setActiveTheme(newTheme);
  };

  // Return early with disabled UI if we're not yet mounted (during SSR or hydration)
  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex h-8 rounded-full bg-background p-1 ring-1 ring-border opacity-50",
          className
        )}
      >
        {themes.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className="relative h-6 w-6 rounded-full"
            aria-hidden={true}
          >
            <Icon
              className={cn("relative m-auto h-4 w-4 text-muted-foreground")}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        // Use the local state for determining active state
        const isActive = activeTheme === key;

        return (
          <button
            type="button"
            key={key}
            className="relative h-6 w-6 rounded-full"
            onClick={() =>
              handleThemeChange(key as "light" | "dark" | "system")
            }
            aria-label={label}
            tabIndex={0}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
