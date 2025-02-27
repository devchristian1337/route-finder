## RouteFinder

![RouteFinder Preview](https://iili.io/3d71X3J.png)

RouteFinder is a web-based tool that helps you discover and map all accessible routes on a website. It utilizes Google Search to find indexed pages on a domain, providing a comprehensive view of a website's structure. This can be particularly useful for:

- Website auditing and SEO analysis
- Content discovery and mapping
- Finding hidden or forgotten pages
- Understanding website architecture
- Analyzing site structure for optimization

## Features

- **Simple URL Input**: Enter any website URL to begin scanning
- **Adjustable Results**: Control how many pages to discover (1-100)
- **Clean Interface**: Modern, responsive UI built with React and Tailwind CSS
- **Route Details**: View paths, titles, and descriptions for each discovered route
- **External Link Detection**: Automatically identifies and marks external links
- **Real-time Feedback**: Loading indicators and toast notifications
- **Error Handling**: Graceful error handling with helpful messages

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: Zustand
- **API Integration**: Axios
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Fetching**: TanStack Query (React Query)
- **External API**: ScrapingBee (for Google Search)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- ScrapingBee API key ([Get one here](https://www.scrapingbee.com/))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/route-finder.git
   cd route-finder
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory based on `.env.example`:

   ```
   VITE_SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage

1. Enter a website URL in the input field (e.g., example.com)
2. Use the slider to set the maximum number of results (default: 30)
3. Click "Find Routes" to begin scanning
4. View the discovered routes with their paths and details
5. Click on any route to visit that page

## How It Works

RouteFinder uses the ScrapingBee API to perform Google Search queries with the `site:` operator. This discovers all indexed pages on the specified domain. The application processes these results to extract paths, titles, and descriptions, then presents them in an organized and user-friendly interface.

## Environment Variables

| Variable                 | Description              | Required |
| ------------------------ | ------------------------ | -------- |
| VITE_SCRAPINGBEE_API_KEY | Your ScrapingBee API key | Yes      |

## Troubleshooting

### API Key Issues

- **Error: "ScrapingBee API key is missing"** - Ensure you've created a `.env` file with your API key as shown in the installation steps.
- **Error: "Failed to fetch data from Google Search"** - Verify your API key is valid and has enough credits. Check the [ScrapingBee dashboard](https://app.scrapingbee.com/account/usage) for usage information.

### Rate Limiting

- If you're experiencing rate limiting, try reducing the maximum number of results requested or wait a few minutes before trying again.

### No Routes Found

- Some websites may block scraping or have robots.txt rules preventing indexing. Try another website or reduce the number of results.
- Ensure the URL is correctly formatted. If unsure, include the full URL with `https://` prefix.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
