import React, { useState, useEffect } from "react";
import { useRouteStore } from "../store/routeStore";
import RouteCard from "./RouteCard";
import LoadingState from "./LoadingState";
import { ExternalLink, AlertCircle, Compass, Download } from "lucide-react";
import { LinkPreview } from "./ui/link-preview";
import { toast } from "sonner";
import { AnimatedText } from "./ui/animated-shiny-text";
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
  const { routes, isLoading, error, url, hasSearched } = useRouteStore();
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
      const hostname = new URL(routes[0]?.url || "").hostname;
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set up and trigger the download
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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

  if (routes.length === 0 && url && hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Compass size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium">No Routes Found</h2>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          We couldn't find any routes for the provided URL. Please verify the
          URL is correct and try again.
          {url && (
            <span className="block mt-2 text-center">
              URL:
              <AnimatedText
                text={
                  new URL(url.startsWith("http") ? url : `https://${url}`)
                    .hostname
                }
                gradientColors="linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)"
                gradientAnimationDuration={3}
                className="py-0 inline-flex ml-1"
                textClassName="text-sm font-medium"
                preserveDefaultSize={false}
              />
            </span>
          )}
        </p>
      </div>
    );
  }

  if (routes.length === 0) {
    return null;
  }

  const currentRoutes = getCurrentPageRoutes();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h2 className="text-xl font-medium">Discovered Routes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Found {routes.length} routes on{" "}
            {routes.length > 0 && (
              <span className="inline-flex items-center">
                <AnimatedText
                  text={new URL(routes[0]?.url || "").hostname}
                  gradientColors="linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)"
                  gradientAnimationDuration={3}
                  className="py-0 inline-flex"
                  textClassName="text-sm font-medium"
                  preserveDefaultSize={false}
                />
              </span>
            )}
            {routes.length === 0 && url && (
              <span>
                {
                  new URL(url.startsWith("http") ? url : `https://${url}`)
                    .hostname
                }
              </span>
            )}{" "}
            {routes.length > ROUTES_PER_PAGE &&
              `(showing ${(currentPage - 1) * ROUTES_PER_PAGE + 1}-${Math.min(
                currentPage * ROUTES_PER_PAGE,
                routes.length
              )})`}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadRoutes}
            className="flex-1 sm:flex-initial text-sm flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Download all routes"
          >
            <span>Download All</span>
            <Download size={14} />
          </button>
          <LinkPreview
            url={url.startsWith("http") ? url : `https://${url}`}
            width={400}
            height={250}
            quality={80}
            className="flex-1 sm:flex-initial"
          >
            <a
              href={url.startsWith("http") ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial text-sm flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors w-full"
            >
              <span>Visit Site</span>
              <ExternalLink size={14} />
            </a>
          </LinkPreview>
        </div>
      </div>

      <div className="grid gap-3">
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
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`cursor-pointer ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>

            {/* Page numbers */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-default" />
              </PaginationItem>
            )}

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink isActive className="cursor-default">
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-default" />
              </PaginationItem>
            )}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next page button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`cursor-pointer ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RouteList;
