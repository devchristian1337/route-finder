import React, { useState, useEffect } from "react";
import { useRouteStore } from "../store/routeStore";
import RouteCard from "./RouteCard";
import LoadingState from "./LoadingState";
import { ExternalLink, AlertCircle, Compass, Download } from "lucide-react";
import { LinkPreview } from "./ui/link-preview";
import { toast } from "sonner";
import { AnimatedText } from "./ui/animated-shiny-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ROUTES_PER_PAGE = 10;

const RouteList = () => {
  const { routes, isLoading, error, url, lastSearchedUrl, hasSearched } =
    useRouteStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to page 1 when routes change
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(Math.max(1, Math.ceil(routes.length / ROUTES_PER_PAGE)));
  }, [routes]);

  // Get current page routes
  const getCurrentPageRoutes = () => {
    const startIndex = (currentPage - 1) * ROUTES_PER_PAGE;
    const endIndex = startIndex + ROUTES_PER_PAGE;
    return routes.slice(startIndex, endIndex);
  };

  // Function to get the hostname without protocol
  const getHostnameWithoutProtocol = (urlString) => {
    try {
      // Add https:// if no protocol is present to make URL parsing work
      const fullUrl = urlString.startsWith("http")
        ? urlString
        : `https://${urlString}`;
      const hostname = new URL(fullUrl).hostname;
      return hostname;
    } catch (error) {
      return urlString; // Return original string if parsing fails
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of route list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to handle downloading all routes as a text file
  const handleDownloadRoutes = () => {
    if (!routes.length) {
      toast.error("No routes available to download");
      return;
    }

    try {
      // Format the routes data in a structured way
      const hostname = getHostnameWithoutProtocol(lastSearchedUrl || url);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `routes-${hostname}-${timestamp}.txt`;

      // Create the content with a header
      let content = `# Routes for ${hostname}\n`;
      content += `# Exported on ${new Date().toLocaleString()}\n`;
      content += `# Total routes: ${routes.length}\n\n`;

      // Add each route with its details
      routes.forEach((route, index) => {
        content += `[${index + 1}] ${route.path}\n`;
        content += `URL: ${route.url}\n`;

        if (route.title) {
          content += `Title: ${route.title}\n`;
        }

        if (route.description) {
          content += `Description: ${route.description}\n`;
        }

        content += `\n`; // Add a blank line between routes
      });

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set up and trigger the download
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Downloaded ${routes.length} routes to ${filename}`);
    } catch (error) {
      console.error("Error downloading routes:", error);
      toast.error("Failed to download routes");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-destructive" />
        </div>
        <h2 className="text-xl font-medium">Error Occurred</h2>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (routes.length === 0 && lastSearchedUrl && hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Compass size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium">No Routes Found</h2>
        <div className="text-sm text-muted-foreground text-center max-w-md mt-2">
          We couldn't find any routes for the provided URL. Please verify the
          URL is correct and try again.
          {lastSearchedUrl && (
            <span className="block mt-2 text-center">
              URL:
              <AnimatedText
                text={getHostnameWithoutProtocol(lastSearchedUrl)}
                gradientColors="linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)"
                gradientAnimationDuration={3}
                className="py-0 inline-flex ml-1"
                textClassName="text-sm font-medium"
                preserveDefaultSize={false}
              />
            </span>
          )}
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return null;
  }

  const currentRoutes = getCurrentPageRoutes();
  const displayHostname = getHostnameWithoutProtocol(lastSearchedUrl || url);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h2 className="text-xl font-medium">Discovered Routes</h2>
          <div className="text-sm text-muted-foreground mt-1">
            Found {routes.length} routes on{" "}
            <span className="inline-flex items-center">
              <AnimatedText
                text={displayHostname}
                gradientColors="linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)"
                gradientAnimationDuration={3}
                className="py-0 inline-flex"
                textClassName="text-sm font-medium"
                preserveDefaultSize={false}
              />
            </span>
            {routes.length > ROUTES_PER_PAGE &&
              ` (showing ${(currentPage - 1) * ROUTES_PER_PAGE + 1}-${Math.min(
                currentPage * ROUTES_PER_PAGE,
                routes.length
              )})`}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDownloadRoutes}
                  className="flex-1 sm:flex-initial text-sm flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors select-none"
                  aria-label="Download all routes"
                >
                  <span>Download All</span>
                  <Download size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent showArrow>
                <p>Download all routes as a text file</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <LinkPreview
                  url={
                    (lastSearchedUrl || url).startsWith("http")
                      ? lastSearchedUrl || url
                      : `https://${lastSearchedUrl || url}`
                  }
                  width={400}
                  height={250}
                  quality={80}
                  className="flex-1 sm:flex-initial"
                >
                  <a
                    href={
                      (lastSearchedUrl || url).startsWith("http")
                        ? lastSearchedUrl || url
                        : `https://${lastSearchedUrl || url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial text-sm flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors w-full select-none"
                  >
                    <span>Visit Site</span>
                    <ExternalLink size={14} />
                  </a>
                </LinkPreview>
              </TooltipTrigger>
              <TooltipContent showArrow>
                <div className="space-y-1">
                  <p className="text-[13px] font-medium">Visit Website</p>
                  <p className="text-xs text-muted-foreground">
                    Open the website in a new tab
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-8">
        {currentRoutes.map((route, index) => (
          <RouteCard
            key={`${route.path}-${index}`}
            path={route.path}
            url={route.url}
            index={index}
            title={route.title}
            description={route.description}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8 select-none">
          <PaginationContent>
            {/* Previous page button */}
            <PaginationItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </PaginationItem>

            {/* Page numbers */}
            {currentPage > 1 && (
              <PaginationItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>First page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-default" />
              </PaginationItem>
            )}

            {currentPage > 2 && (
              <PaginationItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="cursor-pointer"
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Page {currentPage - 1}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PaginationItem>
            )}

            <PaginationItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationLink isActive className="cursor-default">
                      {currentPage}
                    </PaginationLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </PaginationItem>

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="cursor-pointer"
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Page {currentPage + 1}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PaginationItem>
            )}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-default" />
              </PaginationItem>
            )}

            {currentPage < totalPages && (
              <PaginationItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PaginationItem>
            )}

            {/* Next page button */}
            <PaginationItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`cursor-pointer ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RouteList;
