
import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface RouteCardProps {
  path: string;
  url: string;
  index: number;
}

const RouteCard: React.FC<RouteCardProps> = ({ path, url, index }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Calculate delay for staggered animation
  const animationDelay = `${index * 50}ms`;
  
  return (
    <div 
      className="glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-md opacity-0 animate-fade-in"
      style={{ animationDelay }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate" title={path}>
            {path}
          </h3>
          <p className="text-sm text-muted-foreground truncate mt-1" title={url}>
            {url}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title="Copy URL"
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
          >
            <ExternalLink size={16} className="text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
