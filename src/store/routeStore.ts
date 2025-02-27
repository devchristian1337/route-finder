
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';

interface Route {
  path: string;
  url: string;
  isExternal?: boolean;
}

interface RouteState {
  url: string;
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  setUrl: (url: string) => void;
  fetchRoutes: () => Promise<void>;
  resetState: () => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  url: '',
  routes: [],
  isLoading: false,
  error: null,
  
  setUrl: (url) => set({ url }),
  
  fetchRoutes: async () => {
    const { url } = get();
    
    // Validate URL
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    
    try {
      const validatedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      set({ isLoading: true, error: null });
      toast.info('Fetching routes...');
      
      // In a real app, this would call ScrapingBee API
      // For now we'll simulate an API call with a timeout
      setTimeout(async () => {
        try {
          // Normally you would use the ScrapingBee API here
          // const response = await axios.post('https://app.scrapingbee.com/api/v1', { 
          //   url: validatedUrl,
          //   api_key: 'your-api-key' 
          // });
          
          // For the demo, we'll simulate a response:
          console.log(`Fetching routes for: ${validatedUrl}`);
          
          // Create some mock routes
          const domain = new URL(validatedUrl).hostname;
          const mockRoutes: Route[] = [
            { path: '/', url: `https://${domain}/` },
            { path: '/about', url: `https://${domain}/about` },
            { path: '/products', url: `https://${domain}/products` },
            { path: '/services', url: `https://${domain}/services` },
            { path: '/contact', url: `https://${domain}/contact` },
            { path: '/blog', url: `https://${domain}/blog` },
            { path: '/blog/post-1', url: `https://${domain}/blog/post-1` },
            { path: '/blog/post-2', url: `https://${domain}/blog/post-2` },
            { path: '/blog/post-3', url: `https://${domain}/blog/post-3` },
            { path: '/faq', url: `https://${domain}/faq` },
            { path: '/pricing', url: `https://${domain}/pricing` },
            { path: '/terms', url: `https://${domain}/terms` },
            { path: '/privacy', url: `https://${domain}/privacy` },
          ];
          
          set({ routes: mockRoutes, isLoading: false });
          toast.success(`Found ${mockRoutes.length} routes`);
        } catch (error) {
          console.error('Error fetching routes:', error);
          set({ error: 'Failed to fetch routes. Please try again.', isLoading: false });
          toast.error('Failed to fetch routes');
        }
      }, 2000); // Simulate network delay
      
    } catch (error) {
      console.error('Error processing URL:', error);
      set({ error: 'Invalid URL format', isLoading: false });
      toast.error('Invalid URL format');
    }
  },
  
  resetState: () => set({ routes: [], error: null })
}));
