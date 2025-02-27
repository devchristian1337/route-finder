
import React from 'react';
import { Compass } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-50 blur-xl animate-pulse-opacity"></div>
        <Compass size={48} className="animate-spin text-primary opacity-80" style={{ animationDuration: '3s' }} />
      </div>
      <h2 className="mt-6 text-xl font-medium">Mapping Routes</h2>
      <p className="text-muted-foreground text-sm mt-2">This may take a moment...</p>
      
      <div className="mt-8 w-64 h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-shimmer animate-shimmer"></div>
      </div>
      
      <div className="mt-8 max-w-sm text-center text-sm text-muted-foreground">
        <p>We're scanning the website to discover all available routes and endpoints.</p>
      </div>
    </div>
  );
};

export default LoadingState;
