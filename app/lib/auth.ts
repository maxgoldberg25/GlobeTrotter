import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
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
  
  return useCallback(async () => {
    // First perform the sign out
    await nextAuthSignOut({
      redirect: false,
    });
    
    // Then manually navigate to ensure clean state
    router.push('/');
    router.refresh(); // Force a full refresh to ensure clean state
  }, [router]);
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