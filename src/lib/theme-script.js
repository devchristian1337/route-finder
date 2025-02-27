// This script runs before React is loaded
(function () {
  try {
    // Check if there's a saved preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    let theme;

    if (
      savedTheme === "dark" ||
      savedTheme === "light" ||
      savedTheme === "system"
    ) {
      // Use saved theme if it exists and is valid
      theme = savedTheme;

      // If system theme, detect user preference
      if (theme === "system") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    } else {
      // If no saved theme or invalid theme, use system preference
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      // Store "system" as the theme preference
      localStorage.setItem("theme", "system");
    }

    // Apply theme immediately
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  } catch (e) {
    // Try to detect system preference even if there's an error
    try {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(systemTheme);
    } catch {
      // Fallback to light mode if everything fails
      document.documentElement.classList.add("light");
    }
  }
})();
