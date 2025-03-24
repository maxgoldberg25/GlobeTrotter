import { useSession, signOut } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
 * Enhanced sign out function that ensures proper redirect and state cleanup
 */
export function useSignOut() {
  const router = useRouter();
  
  return async () => {
    // Sign out with force: true to invalidate session across tabs
    await signOut({ 
      redirect: false,
      callbackUrl: '/'
    });
    
    // Force a client-side navigation to home page to clear state
    router.push('/');
    router.refresh();
  };
}

/**
 * Hook to track navigation and refresh session on back/forward navigation
 */
export function useNavigationAuth() {
  const { update } = useSession();
  
  useEffect(() => {
    const handlePopState = async () => {
      // When user navigates with browser buttons, force update session
      await update();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [update]);
} 