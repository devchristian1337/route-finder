import axios from "axios";

interface ScrapingBeeConfig {
  apiKey: string;
  url: string;
  options?: {
    extractRules?: Record<string, unknown>;
    waitForSelector?: string;
    wait?: number; // Wait time in milliseconds
  };
}

interface GoogleSearchConfig {
  apiKey: string;
  domain: string;
  numResults?: number;
  language?: string;
}

interface GoogleSearchResult {
  url: string;
  displayed_url: string;
  description: string;
  position: number;
  title: string;
  domain: string;
}

interface GoogleSearchResponse {
  meta_data: {
    url: string;
    number_of_results: number;
    number_of_organic_results: number;
  };
  organic_results: GoogleSearchResult[];
}

interface LinkData {
  href: string | null;
  text: string | null;
}

interface RouteData {
  path: string;
  url: string;
  isExternal: boolean;
  title?: string;
  description?: string;
}

// Function to use Google Search API to find routes
export const fetchRoutesViaGoogleSearch = async (
  config: GoogleSearchConfig
) => {
  try {
    const { apiKey, domain, numResults = 30, language = "en" } = config;

    // Clean the domain to ensure it's in the correct format
    let cleanDomain = domain.trim();

    // Remove protocol if present
    if (
      cleanDomain.startsWith("http://") ||
      cleanDomain.startsWith("https://")
    ) {
      cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
    }

    // Remove trailing slash if present
    if (cleanDomain.endsWith("/")) {
      cleanDomain = cleanDomain.slice(0, -1);
    }

    // Construct the search query with site: operator
    const searchQuery = `site:${cleanDomain}`;

    // Construct the ScrapingBee Google API URL
    const apiUrl = "https://app.scrapingbee.com/api/v1/store/google";

    // Make the request to ScrapingBee Google Search API
    const response = await axios({
      method: "GET",
      url: apiUrl,
      params: {
        api_key: apiKey,
        search: searchQuery,
        language,
        nb_results: numResults,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Extract routes from the search results
    const searchData = response.data as GoogleSearchResponse;
    const routes = extractRoutesFromGoogleResults(searchData, cleanDomain);

    return {
      success: true,
      data: { routes },
    };
  } catch (error) {
    console.error("Error fetching from Google Search API:", error);
    // Log additional error details if available
    if (error.response) {
      console.error("Google Search API error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      // Check for authentication/API key errors
      if (error.response.status === 401 || error.response.status === 403) {
        return {
          success: false,
          error:
            "Invalid or expired ScrapingBee API key. Please check your API key and try again.",
          isApiKeyError: true,
        };
      }
    }

    return {
      success: false,
      error: error.message || "Failed to fetch data from Google Search",
      isApiKeyError: error.message?.toLowerCase().includes("api key"),
    };
  }
};

// Helper function to extract structured route data from Google search results
const extractRoutesFromGoogleResults = (
  searchData: GoogleSearchResponse,
  baseDomain: string
): RouteData[] => {
  try {
    if (!searchData?.organic_results?.length) {
      console.warn("No organic results found in Google Search response");
      return [];
    }

    // Get the base domain format for comparison
    const domainWithProtocol = baseDomain.startsWith("http")
      ? baseDomain
      : `https://${baseDomain}`;

    const baseUrl = new URL(domainWithProtocol);
    const routes: RouteData[] = [];
    const seenUrls = new Set<string>(); // To prevent duplicate URLs

    // Process each search result, focusing on the URL field
    for (const result of searchData.organic_results) {
      try {
        // Skip if result has no URL or it's invalid
        if (!result.url) {
          console.warn("Skipping result with no URL");
          continue;
        }

        // Skip if we've already processed this URL
        if (seenUrls.has(result.url)) {
          continue;
        }

        seenUrls.add(result.url);

        // Create URL object
        const url = new URL(result.url);

        // Extract path component
        const path = url.pathname + url.search + url.hash || "/";

        // Determine if it's external
        const isExternal = url.hostname !== baseUrl.hostname;

        // Add the route with the original URL from the Google Search results
        routes.push({
          path: path,
          url: result.url, // The URL field from Google Search results
          isExternal,
          title: result.title,
          description: result.description,
        });
      } catch (e) {
        console.warn("Error processing search result:", e);
      }
    }

    return routes;
  } catch (error) {
    console.error("Error extracting routes from Google results:", error);
    return [];
  }
};

// For legacy support, we still export these functions but they're not used anymore
// Removing unused exports per knip report
/* 
export const fetchRoutes = async (config: ScrapingBeeConfig) => {
  console.warn("fetchRoutes is deprecated - using Google Search API instead");
  const { apiKey, url } = config;

  // Extract domain from URL for Google Search
  let domain = url;
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname;
  } catch (e) {
    // If URL is invalid, just use it as is
  }

  // Call Google Search API instead
  return fetchRoutesViaGoogleSearch({
    apiKey,
    domain,
  });
};

export const processRoutesFromLinks = (
  links: LinkData[],
  baseUrl: string
): RouteData[] => {
  console.warn(
    "processRoutesFromLinks is deprecated - using Google Search API instead"
  );
  return [];
};
*/
