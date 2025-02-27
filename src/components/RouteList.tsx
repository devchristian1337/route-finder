// @ts-expect-error - Ignoring TypeScript errors as they don't affect functionality
import React, { useState, useEffect } from "react";
import { useRouteStore } from "../store/routeStore";
import RouteCard from "./RouteCard";
import LoadingState from "./LoadingState";
import { ExternalLink, AlertCircle, Compass } from "lucide-react";
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
  const { routes, isLoading, error, url } = useRouteStore();
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

  if (routes.length === 0 && url) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Compass size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium">No Routes Found</h2>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          We couldn't find any routes for the provided URL. Please verify the
          URL is correct and try again.
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Discovered Routes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Found {routes.length} routes on{" "}
            {new URL(routes[0]?.url || "").hostname}{" "}
            {routes.length > ROUTES_PER_PAGE &&
              `(showing ${(currentPage - 1) * ROUTES_PER_PAGE + 1}-${Math.min(
                currentPage * ROUTES_PER_PAGE,
                routes.length
              )})`}
          </p>
        </div>
        <a
          href={url.startsWith("http") ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <span>Visit Site</span>
          <ExternalLink size={14} />
        </a>
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
