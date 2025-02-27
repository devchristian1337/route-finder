
import React, { useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { useRouteStore } from '../store/routeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UrlInput = () => {
  const {
    url,
    setUrl,
    fetchRoutes,
    isLoading
  } = useRouteStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutes();
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ease-in-out ${isFocused ? 'glass-card shadow-lg scale-[1.02]' : 'glass-card shadow-md'} overflow-hidden rounded-2xl`}>
          <div className="flex items-center w-full">
            <div className="flex items-center flex-1 pl-4">
              <Search size={16} className={`text-muted-foreground transition-colors ${isFocused ? 'text-primary' : ''}`} />
              <Input 
                type="text" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)} 
                placeholder="Enter website URL (e.g., example.com)" 
                disabled={isLoading} 
                className="flex-grow h-9 py-1.5 px-3 border-none text-sm bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70 mx-[8px]" 
              />
              {url && (
                <button 
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !url} 
              className="h-9 rounded-l-none px-4 py-1.5 text-xs font-medium transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                  <span>Scanning</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Find Routes</span>
                  <ArrowRight size={14} />
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
