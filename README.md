# Route Finder

A web application that discovers routes and pages for any website using either direct scraping or Google Search API.

## Features

- **Two Discovery Methods**:

  - **Google Search API** - Uses Google's index to find routes and pages for a specific domain.
  - **Direct Scraping** - Extracts links directly from the rendered HTML of a webpage.

- **Rich Route Information**:

  - Page titles and descriptions (when using Google Search)
  - Path information and URLs
  - External link detection

- **Modern UI**:
  - Clean, responsive interface
  - Animation effects for a smooth user experience
  - Loading states and error handling

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install` or `yarn`
3. Add your ScrapingBee API key to a `.env` file:
   ```
   VITE_SCRAPINGBEE_API_KEY=your_api_key_here
   ```
4. Start the development server: `npm run dev` or `yarn dev`

## Google Search Integration

The application uses ScrapingBee's Google Search API to discover routes for a website. To use this feature:

1. Enter a website URL in the input field
2. Make sure "Use Google Search API" is toggled on
3. Click "Find Routes"

This will search Google for all indexed pages on that domain and display them as routes, including their titles and descriptions.

### Example API Request

```
curl https://app.scrapingbee.com/api/v1/store/google?api_key=YOUR_API_KEY&search=site%3Aexample.com&language=en&nb_results=10
```

This will return a JSON response with Google search results for the domain "example.com".

## Using Direct Scraping

If you prefer to scrape links directly from a website:

1. Enter a website URL in the input field
2. Toggle off "Use Google Search API"
3. Click "Find Routes"

This method works best for websites with simple structures and plenty of internal links on the homepage.

## Technologies

- React
- TypeScript
- TailwindCSS
- Zustand for state management
- ScrapingBee API

## Development Notes

The Google Search API provides more comprehensive results but is limited to pages that Google has indexed. Direct scraping can find unindexed pages but only discovers links present on the specific page being scraped.

For best results, try both methods and compare the results.
