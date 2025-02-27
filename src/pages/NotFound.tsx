
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-subtle from-background via-white to-background p-4">
      <div className="glass-panel rounded-2xl p-12 max-w-md w-full text-center animate-fade-in">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass size={28} className="text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-light mb-2">
          <span className="font-medium">404</span> Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          The route you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="inline-flex items-center gap-2">
          <a href="/">
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
