import React, { useState } from "react";
import { ExternalLink, Copy, Check, Globe } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <div
      className={`glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-md opacity-0 animate-fade-in ${
        description ? "cursor-pointer" : ""
      }`}
      style={{ animationDelay }}
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`Route to ${displayUrl}`}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Main URL display - emphasized */}
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary flex-shrink-0" />
            <h3 className="font-medium truncate" title={url}>
              {displayUrl}
            </h3>
          </div>

          {/* Title when available */}
          {title && (
            <p
              className="text-sm font-medium text-foreground truncate mt-2"
              title={title}
            >
              {title}
            </p>
          )}

          {/* Path information */}
          <p
            className="text-xs text-muted-foreground/70 truncate mt-1"
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
          className="flex items-center space-x-2 ml-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title="Copy URL"
            aria-label="Copy URL to clipboard"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} className="text-muted-foreground" />
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title="Open URL"
            aria-label="Open URL in new tab"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              window.open(url, "_blank", "noopener,noreferrer")
            }
          >
            <ExternalLink size={16} className="text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
