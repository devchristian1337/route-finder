import React from "react";
import { Compass } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 flex justify-center items-center animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2 animate-float">
          <Compass size={32} className="text-primary" />
          <h1 className="text-3xl font-light tracking-tight">
            Route<span className="font-semibold">Finder</span>
          </h1>
        </div>
        <div className="text-center">
          <div className="inline-flex px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-2 select-none">
            Discover • Map • Navigate
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto px-4">
            Enter a website URL to discover and map all accessible routes
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
