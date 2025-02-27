import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouteStore } from "../store/routeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UrlInput = () => {
  const { url, setUrl, fetchRoutes, isLoading } = useRouteStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      fetchRoutes();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            isFocused
              ? "glass-card shadow-lg transform scale-[1.01]"
              : "glass-card shadow-md"
          } rounded-xl overflow-hidden`}
        >
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center pl-4">
              <Search
                size={20}
                className={`transition-colors duration-300 ${
                  isFocused ? "text-primary" : "text-muted-foreground"
                }`}
                aria-hidden="true"
              />
            </div>

            <div className="flex-grow">
              <Input
                type="url"
                value={url}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Enter website URL (e.g., example.com)"
                className="h-12 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70"
                disabled={isLoading}
                aria-label="Website URL"
                spellCheck="false"
                autoComplete="url"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="h-12 rounded-l-none px-5 transition-all duration-300"
              aria-label={isLoading ? "Scanning routes" : "Find routes"}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  <span className="font-medium">Scanning</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Find Routes</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UrlInput;
