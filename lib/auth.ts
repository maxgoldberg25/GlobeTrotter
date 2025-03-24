import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Make sure this matches your login page route
    signOut: "/logout",
    error: "/error",
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing email or password");
            return null;
          }
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
          
          if (!user || !user.hashedPassword) {
            console.log("User not found or missing password");
            return null;
          }
          
          const isPasswordValid = await compare(
            credentials.password,
            user.hashedPassword
          );
          
          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }
          
          console.log("Auth successful for user:", user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? undefined;
        token.picture = user.image ?? undefined;
      }
      
      // Ensure id exists (copy from sub if needed)
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      console.log("Session callback - current session:", session);
      
      if (token && session.user) {
        session.user.id = token.id as string || token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        
        console.log("Updated session with user ID:", session.user.id);
      }
      
      return session;
    }
  }
}; 