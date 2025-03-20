'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Force a session check on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      // The empty function will trigger useEffect on route changes
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <SessionProvider 
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
} 