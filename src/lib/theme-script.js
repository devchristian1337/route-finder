// This script runs before React is loaded
(function () {
  try {
    // Always default to dark mode
    let theme = "dark";

    // Check if there's a saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme = savedTheme;
    }

    // Apply theme immediately
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Store it
    localStorage.setItem("theme", theme);
  } catch (e) {
    // Fallback to dark if there's an error
    document.documentElement.classList.add("dark");
  }
})();
