import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

/**
 * Hook to force session refresh when component mounts
 * Useful for components that need the latest auth state
 */
export function useRefreshSession() {
  const { update } = useSession();
  
  useEffect(() => {
    // Force a session update when the component mounts
    // This helps with navigation scenarios like back button
    const refreshSession = async () => {
      await update();
    };
    
    refreshSession();
  }, [update]);
}

/**
 * A simplified hook that only refreshes auth state when actually needed,
 * such as when the user explicitly navigates using browser controls
 */
export function useAuthSync() {
  const { update } = useSession();
  const lastUpdateRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Only handle popstate events (back/forward navigation)
    const handlePopState = () => {
      // Debounce updates to prevent rapid re-renders
      const now = Date.now();
      if (now - lastUpdateRef.current > 1000) { // Only update once per second at most
        lastUpdateRef.current = now;
        update();
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [update]);
} 