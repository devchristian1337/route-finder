import React, { useState } from "react";
import { ExternalLink, Copy, Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { LinkPreview } from "./ui/link-preview";
import { GlowEffect } from "./ui/glow-effect";

interface RouteCardProps {
  path: string;
  url: string;
  index: number;
  title?: string;
  description?: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
  path,
  url,
  index,
  title,
  description,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    if (description) {
      setExpanded(!expanded);
    }
  };

  // Calculate delay for staggered animation
  const animationDelay = `${index * 50}ms`;

  // Format URL for display
  const displayUrl = (() => {
    try {
      const urlObj = new URL(url);
      // Show domain + path (first 30 chars)
      return `${urlObj.hostname}${urlObj.pathname.substring(0, 30)}${
        urlObj.pathname.length > 30 ? "..." : ""
      }`;
    } catch (e) {
      return url;
    }
  })();

  // Define glow effect colors based on path or URL properties
  const generateGlowColors = () => {
    // Use the same colors as the AnimatedText component for consistency
    return ["#3b82f6", "#8b5cf6", "#3b82f6"];
  };

  return (
    <div
      className="relative opacity-0 animate-fade-in"
      style={{ animationDelay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow effect with smooth transition */}
      <div
        className={`absolute -inset-[2px] rounded-lg z-0 transition-opacity duration-300 ease-in-out ${
          hovered ? "opacity-70" : "opacity-0"
        }`}
      >
        <GlowEffect
          colors={generateGlowColors()}
          mode="colorShift"
          blur="medium"
          scale={1.0}
          duration={3}
        />
      </div>

      {/* Content container with original background */}
      <div
        className={`relative rounded-lg bg-card p-3 sm:p-4 text-foreground transition-all duration-300 ${
          hovered ? "transform scale-[1.02]" : ""
        } hover:shadow-md border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer`}
        onClick={handleCardClick}
        tabIndex={0}
        aria-label={`Route to ${displayUrl}`}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            {/* Main URL display - emphasized */}
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary flex-shrink-0" />
              <LinkPreview url={url} width={300} height={180} quality={75}>
                <h3
                  className="font-medium truncate hover:text-primary transition-colors max-w-[calc(100vw-120px)] sm:max-w-full"
                  title={url}
                >
                  {displayUrl}
                </h3>
              </LinkPreview>
            </div>

            {/* Title when available */}
            {title && (
              <p
                className="text-sm font-medium text-foreground truncate mt-2 max-w-[calc(100vw-100px)] sm:max-w-full"
                title={title}
              >
                {title}
              </p>
            )}

            {/* Path information */}
            <p
              className="text-xs text-muted-foreground/70 truncate mt-1 max-w-[calc(100vw-100px)] sm:max-w-full"
              title={path}
            >
              {path}
            </p>

            {/* Description section that expands on click */}
            {description && (
              <div
                className={`mt-2 overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-32" : "max-h-0"
                }`}
              >
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
          <div
            className="flex items-center space-x-2 sm:ml-4 mt-2 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-full hover:bg-secondary transition-colors touch-action-manipulation"
              title="Copy URL"
              aria-label="Copy URL to clipboard"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-muted-foreground" />
              )}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-secondary transition-colors touch-action-manipulation"
              title="Open URL"
              aria-label="Open URL in new tab"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                window.open(url, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink size={18} className="text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
