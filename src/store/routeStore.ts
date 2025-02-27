import { create } from "zustand";
import { toast } from "sonner";
import { fetchRoutesViaGoogleSearch } from "../utils/api";

interface Route {
  path: string;
  url: string;
  isExternal?: boolean;
  title?: string;
  description?: string;
}

interface RouteState {
  url: string;
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  setUrl: (url: string) => void;
  fetchRoutes: (numResults?: number) => Promise<void>;
  resetState: () => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  url: "",
  routes: [],
  isLoading: false,
  error: null,
  hasSearched: false,

  setUrl: (url) => set({ url }),

  fetchRoutes: async (numResults = 30) => {
    const { url } = get();

    // Validate URL
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      // Basic URL validation - make sure we have a valid URL with proper protocol
      let validatedUrl = url.trim();

      // If URL doesn't start with http or https, add https://
      if (!validatedUrl.match(/^https?:\/\//i)) {
        validatedUrl = `https://${validatedUrl}`;
      }

      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_SCRAPINGBEE_API_KEY;

      if (!apiKey) {
        throw new Error(
          "ScrapingBee API key is missing. Please add it to your .env file."
        );
      }

      // Set loading state
      set({ isLoading: true, error: null, routes: [], hasSearched: true });

      const response = await fetchRoutesViaGoogleSearch({
        apiKey,
        domain: validatedUrl,
        numResults, // Use the provided numResults parameter
        language: "en",
      });

      if (!response.success) {
        throw new Error(
          response.error || "Failed to fetch data from Google Search"
        );
      }

      const { routes } = response.data;

      if (!routes || !Array.isArray(routes) || routes.length === 0) {
        throw new Error("No routes were found via Google Search");
      }

      set({ routes, isLoading: false });
      toast.success(`Found ${routes.length} routes`);
    } catch (error) {
      console.error("Error fetching routes:", error);
      set({
        error: error.message || "Failed to fetch routes. Please try again.",
        isLoading: false,
      });
      toast.error(error.message || "Failed to fetch routes");
    }
  },

  resetState: () => set({ routes: [], error: null, hasSearched: false }),
}));
