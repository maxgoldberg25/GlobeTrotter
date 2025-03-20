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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Skip database connection during build time
        if (process.env.VERCEL_ENV === 'build') {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user?.hashedPassword) {
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }

          // Return only the fields NextAuth expects for User
          return {
            id: user.id,
            name: user.name || undefined,
            email: user.email || undefined,
            image: user.image || undefined,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
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
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only',
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler with named exports for GET and POST
export { handler as GET, handler as POST }; 