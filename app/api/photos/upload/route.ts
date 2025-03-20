import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to upload photos" },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    const { title, description, location, latitude, longitude, imageUrl } = data;
    
    // Validate required fields
    if (!title || !imageUrl || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new photo in database
    const newPhoto = await prisma.photo.create({
      data: {
        title,
        description: description || "",
        location: location || "",
        latitude,
        longitude,
        imageUrl,
        userId: user.id,
      },
    });
    
    return NextResponse.json(
      { success: true, photo: newPhoto },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
} 