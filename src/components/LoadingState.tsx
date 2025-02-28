import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC =
  "https://lottie.host/e102dd32-1701-4361-ac3e-60f88c4295cb/55Ft5olW33.lottie";

const LoadingState = () => {
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  useEffect(() => {
    // Preload the Lottie animation
    const preloadLottie = async () => {
      try {
        const response = await fetch(LOTTIE_SRC);
        if (response.ok) {
          setIsLottieLoaded(true);
        }
      } catch (error) {
        console.error("Failed to preload Lottie animation:", error);
        // Still set to true to show fallback animation if needed
        setIsLottieLoaded(true);
      }
    };

    preloadLottie();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-8 animate-fade-in">
      <div className="glass-card shadow-md border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {isLottieLoaded ? (
              <DotLottieReact
                src={LOTTIE_SRC}
                loop
                autoplay
                key="loading-animation"
              />
            ) : (
              // Simple loading placeholder until Lottie is ready
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <h2 className="mt-2 text-xl font-medium">Mapping Routes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This may take a moment...
          </p>

          <div className="mt-6 w-full max-w-md h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-shimmer animate-shimmer"></div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              We're scanning the website to discover all available routes and
              endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
