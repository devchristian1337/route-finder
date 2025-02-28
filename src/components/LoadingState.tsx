import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
      <div className="relative w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/451276c9-91ab-4faf-b030-f9a6c38500f7/MchOXLwQ1s.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      </div>
      <h2 className="mt-1 text-xl font-medium">Mapping Routes</h2>
      <p className="text-muted-foreground text-sm mt-1">
        This may take a moment...
      </p>

      <div className="mt-4 w-64 h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-shimmer animate-shimmer"></div>
      </div>

      <div className="mt-4 max-w-sm text-center text-sm text-muted-foreground">
        <p>
          We're scanning the website to discover all available routes and
          endpoints.
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
