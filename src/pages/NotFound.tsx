import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/40 via-white to-white p-4">
      <div className="backdrop-blur-sm bg-white/90 shadow-md border border-slate-100 rounded-2xl p-8 md:p-12 max-w-md w-full text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Compass size={32} className="text-blue-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl font-light mb-3 text-gray-800">
          <span className="font-semibold">404</span> Not Found
        </h1>

        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The route{" "}
          <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
            {location.pathname}
          </span>{" "}
          doesn't exist or has been moved.
        </p>

        <div className="flex justify-center">
          <Button
            asChild
            variant="default"
            className="items-center gap-2 px-6 py-5 text-base"
            aria-label="Return to home page"
          >
            <a href="/">
              <Home size={18} />
              <span>Go to Home</span>
            </a>
          </Button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-8">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFound;
