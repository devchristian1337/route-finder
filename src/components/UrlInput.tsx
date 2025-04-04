import React, { useState, useRef } from "react";
import { Search, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { useRouteStore } from "../store/routeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const UrlInput = () => {
  const { url, setUrl, fetchRoutes, isLoading } = useRouteStore();
  const [isFocused, setIsFocused] = useState(false);
  const [resultsCount, setResultsCount] = useState(30);
  const [isResultsPopoverOpen, setIsResultsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUrl("");
    inputRef.current?.focus();
  };

  const handleResultsCountChange = (value: number[]) => {
    setResultsCount(value[0]);
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent) => {
    if (
      e.relatedTarget &&
      (e.relatedTarget as HTMLElement).getAttribute("data-clear-button") ===
        "true"
    ) {
      return;
    }
    setIsFocused(false);
  };

  const performSearch = () => {
    // Process the URL first for validation if needed
    const trimmedUrl = url.trim();

    if (trimmedUrl) {
      fetchRoutes(resultsCount);
    } else {
      // If the URL is empty, focus the input field for better UX
      inputRef.current?.focus();
      // Optionally set an error message
      setUrl("insert a url");
      setTimeout(() => {
        if (url === "insert a url") {
          setUrl("");
        }
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  // Direct click handler for the button to ensure it works properly
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative ${
            isFocused ? "glass-card shadow-lg" : "glass-card shadow-md"
          } rounded-xl overflow-hidden flex flex-col sm:flex-row border border-slate-200 dark:border-slate-800`}
        >
          {/* Input Container - Full width on mobile, flex row on desktop */}
          <div className="flex items-center w-full min-w-0">
            <div className="flex items-center justify-center pl-4">
              <Search
                size={20}
                className={`transition-colors duration-300 flex-shrink-0 ${
                  isFocused ? "text-primary" : "text-muted-foreground"
                }`}
                aria-hidden="true"
              />
            </div>

            <div className="flex-grow relative min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Input
                        type="url"
                        value={url}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter website URL (e.g., example.com)"
                        className="h-12 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70 truncate pr-8 select-none"
                        disabled={isLoading}
                        aria-label="Website URL"
                        spellCheck={false}
                        autoComplete="url"
                        ref={inputRef}
                      />
                    </div>
                  </TooltipTrigger>
                  {url && (
                    <TooltipContent side="bottom" className="max-w-[300px]">
                      <p className="text-sm break-all">{url}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {url.trim() && isFocused && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearInput}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  disabled={isLoading}
                  aria-label="Clear input"
                  tabIndex={0}
                  data-clear-button="true"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            {/* Results Count Popover - Visible on all screen sizes */}
            <div className="flex items-center mr-2 border-l border-input/50 pl-3 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover
                      open={isResultsPopoverOpen}
                      onOpenChange={setIsResultsPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-muted-foreground hover:text-foreground focus:ring-0 select-none"
                          aria-label="Adjust maximum results"
                          disabled={isLoading}
                        >
                          <div className="flex items-center gap-1.5">
                            <SlidersHorizontal size={15} />
                            <span className="text-sm font-medium">
                              {resultsCount}
                            </span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4" align="end">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Maximum Results</h4>
                            <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded select-none">
                              {resultsCount}
                            </span>
                          </div>

                          <div className="pt-2">
                            <Slider
                              defaultValue={[resultsCount]}
                              max={100}
                              min={1}
                              step={1}
                              onValueChange={handleResultsCountChange}
                              aria-label="Number of results slider"
                            />
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground pt-1">
                            <span>1</span>
                            <span>50</span>
                            <span>100</span>
                          </div>

                          <p className="text-xs text-muted-foreground pt-2">
                            Control how many pages to discover from the website.
                            Higher values may take longer to process.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Set maximum number of results ({resultsCount})</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Submit Button - Full width on mobile, normal on desktop */}
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading || !url.trim()}
            className="h-12 rounded-xl rounded-t-none sm:rounded-xl w-full sm:w-auto px-5 transition-all duration-300"
            aria-label={isLoading ? "Scanning routes" : "Find routes"}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span className="font-medium">Scanning</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium select-none">Find Routes</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Information about Google Search API */}
      <div className="flex justify-center mt-3">
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Discovering routes using Google Search to find all indexed pages on
          the domain (Max: {resultsCount} results)
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
