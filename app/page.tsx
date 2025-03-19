import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary">GlobeTrotter</h1>
          <p className="mt-3 text-center text-gray-600">
            Share your journey with the world
          </p>
        </div>
        <div className="card mt-8 space-y-4">
          <Link href="/auth/signin" className="block w-full">
            <button className="w-full btn-primary">
              Sign In
            </button>
          </Link>
          <Link href="/auth/signup" className="block w-full">
            <button className="w-full btn-secondary">
              Create an Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 