const handleOAuthSignIn = (provider: string) => {
  signIn(provider, {
    callbackUrl: window.location.origin + '/dashboard',
    redirect: true // Use redirect: true for OAuth
  });
};

// Usage
<button onClick={() => handleOAuthSignIn('google')}>
  Sign in with Google
</button> 