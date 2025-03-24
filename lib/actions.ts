"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          photos: true
        }
      }
    }
  });
} 