
import React from 'react';
import { useRouteStore } from '../store/routeStore';
import RouteCard from './RouteCard';
import LoadingState from './LoadingState';
import { ExternalLink, AlertCircle, Compass } from 'lucide-react';

const RouteList = () => {
  const { routes, isLoading, error, url } = useRouteStore();
  
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
        <p className="text-muted-foreground text-center max-w-md mt-2">{error}</p>
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
          We couldn't find any routes for the provided URL. Please verify the URL is correct and try again.
        </p>
      </div>
    );
  }
  
  if (routes.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Discovered Routes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Found {routes.length} routes on {new URL(routes[0]?.url || '').hostname}
          </p>
        </div>
        <a
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <span>Visit Site</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="grid gap-3">
        {routes.map((route, index) => (
          <RouteCard 
            key={route.path} 
            path={route.path} 
            url={route.url}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteList;
