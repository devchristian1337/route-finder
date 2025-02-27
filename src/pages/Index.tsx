
import React from 'react';
import Header from '../components/Header';
import UrlInput from '../components/UrlInput';
import RouteList from '../components/RouteList';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-subtle from-background via-white to-background pb-20">
      <div className="w-full max-w-5xl mx-auto pt-12 md:pt-20 px-4 space-y-10">
        <Header />
        <UrlInput />
        <RouteList />
      </div>
      
      <footer className="mt-auto w-full text-center py-6 text-sm text-muted-foreground">
        <p>Route Finder &copy; {new Date().getFullYear()} • Built with precision and care</p>
      </footer>
    </div>
  );
};

export default Index;
