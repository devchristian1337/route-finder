import React, { useEffect } from "react";
import Header from "../components/Header";
import UrlInput from "../components/UrlInput";
import RouteList from "../components/RouteList";
import { useTheme } from "../lib/ThemeProvider";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-subtle from-background via-white to-background dark:from-background dark:via-background/90 dark:to-background">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transform hover:scale-105 active:scale-95 transition-all shadow-md"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto pt-12 md:pt-20 px-4 space-y-10 flex-grow">
        <div className="flex justify-between items-center">
          <Header />
        </div>
        <UrlInput />
        <RouteList />
      </div>

      <footer className="w-full text-center py-6 text-sm text-muted-foreground mt-16">
        <p className="flex items-center justify-center gap-2 select-none">
          Made by devchristian1337
          <a
            href="https://github.com/devchristian1337"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-primary transition-colors"
            aria-label="GitHub profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
