
import axios from 'axios';

interface ScrapingBeeConfig {
  apiKey: string;
  url: string;
  options?: {
    extractRules?: Record<string, any>;
    waitForSelector?: string;
    wait?: number; // Wait time in milliseconds
  };
}

export const fetchRoutes = async (config: ScrapingBeeConfig) => {
  try {
    const { apiKey, url, options = {} } = config;
    
    // Construct the ScrapingBee API URL
    const apiUrl = 'https://app.scrapingbee.com/api/v1';
    
    // Default extract rules to get links if none provided
    const extractRules = options.extractRules || {
      links: {
        selector: "a",
        type: "list",
        output: {
          href: { selector: "", attr: "href" },
          text: { selector: "" }
        }
      }
    };
    
    // Prepare request parameters
    const params = {
      api_key: apiKey,
      url,
      extract_rules: JSON.stringify(extractRules),
      render_js: true
    };
    
    if (options.waitForSelector) {
      params['wait_for'] = options.waitForSelector;
    }
    
    if (options.wait) {
      params['wait'] = options.wait;
    }
    
    // Make the request to ScrapingBee
    const response = await axios.get(apiUrl, { params });
    
    // Process and return the data
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching from ScrapingBee:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch data'
    };
  }
};

// Helper function to normalize URLs and extract paths
export const processRoutesFromLinks = (links: any[], baseUrl: string) => {
  try {
    const base = new URL(baseUrl);
    const routes = [];
    
    for (const link of links) {
      try {
        // Skip empty or javascript: links
        if (!link.href || link.href.startsWith('javascript:') || link.href.startsWith('#')) {
          continue;
        }
        
        // Create a URL object
        let url;
        try {
          // Handle both absolute and relative URLs
          url = new URL(link.href, baseUrl);
        } catch (e) {
          console.warn('Invalid URL:', link.href);
          continue;
        }
        
        // Check if this is an external link
        const isExternal = url.hostname !== base.hostname;
        
        // Extract the path
        const path = url.pathname + url.search + url.hash;
        
        // Add to routes if not already present
        if (!routes.some(r => r.url === url.toString())) {
          routes.push({
            path: path || '/',
            url: url.toString(),
            isExternal
          });
        }
      } catch (e) {
        console.warn('Error processing link:', link, e);
      }
    }
    
    return routes;
  } catch (error) {
    console.error('Error processing routes:', error);
    return [];
  }
};
