import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSafePrismaAdapter } from "@/lib/next-auth-prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { User } from "next-auth";

// Define authOptions separately for reuse elsewhere
export const authOptions: NextAuthOptions = {
  adapter: createSafePrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Starting authorization process");
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          throw new Error("Email and password are required");
        }

        // Skip database connection during build time
        if (process.env.VERCEL_ENV === 'build') {
          console.log("Skipping auth in build environment");
          return null;
        }

        try {
          console.log(`Looking up user with email: ${credentials.email}`);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.error("User not found");
            throw new Error("Invalid email or password");
          }

          if (!user.hashedPassword) {
            console.error("User has no password set");
            throw new Error("Invalid account setup. Please contact support.");
          }

          console.log("Comparing passwords");
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            console.error("Password mismatch");
            throw new Error("Invalid email or password");
          }

          console.log("Authentication successful");
          // Return only the fields NextAuth expects for User
          return {
            id: user.id,
            name: user.name || undefined,
            email: user.email || undefined,
            image: user.image || undefined,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.name && typeof token.name === 'string') {
          session.user.name = token.name;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && typeof user.name === 'string') {
        token.name = user.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl + "/dashboard";
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only',
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler with named exports for GET and POST
export { handler as GET, handler as POST }; 