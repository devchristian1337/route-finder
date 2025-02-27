
import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouteStore } from '../store/routeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UrlInput = () => {
  const { url, setUrl, fetchRoutes, isLoading } = useRouteStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutes();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`relative transition-all duration-300 ease-in-out ${
            isFocused 
              ? 'glass-card shadow-lg scale-[1.02]' 
              : 'glass-card shadow-md'
          } overflow-hidden rounded-2xl`}
        >
          <div className="flex items-center w-full pl-4">
            <Search 
              size={18} 
              className={`text-muted-foreground transition-colors ${isFocused ? 'text-primary' : ''}`} 
            />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-grow py-6 px-3 border-none text-base bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              disabled={isLoading || !url}
              className="h-full rounded-l-none px-6 py-6 text-sm font-medium transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Scanning</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Find Routes</span>
                  <ArrowRight size={16} />
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
