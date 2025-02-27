// Simple utility to test ScrapingBee API directly
// You can run this with Node.js: node testScrapingBee.js

const axios = require("axios");

async function testScrapingBee() {
  try {
    // Replace with your actual API key
    const apiKey = process.env.VITE_SCRAPINGBEE_API_KEY || "YOUR_API_KEY_HERE";

    // Try a simple URL that's likely to work
    const url = "https://example.com";

    // Basic API call
    const response = await axios({
      method: "GET",
      url: "https://app.scrapingbee.com/api/v1",
      params: {
        api_key: apiKey,
        url: url,
        render_js: "false", // Simpler request without JS rendering
      },
      responseType: "text",
    });

    console.log("ScrapingBee API Test Result:");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Content Type:", response.headers["content-type"]);
    console.log("Data Type:", typeof response.data);
    console.log("Data Length:", response.data.length);
    console.log("First 200 chars:", response.data.substring(0, 200));

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Error testing ScrapingBee API:");
    console.error("Message:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Status Text:", error.response.statusText);
      console.error("Response Data:", error.response.data);
    }
  }
}

// Execute the test
testScrapingBee();
