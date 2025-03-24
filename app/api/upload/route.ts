import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Configure Cloudinary directly in the file as a fallback
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add interface for Cloudinary result if needed
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

// You'll need to set up a proper file upload solution
// This is a placeholder; consider using a service like Cloudinary, AWS S3, etc.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Add debug logging
    console.log("File received:", file.name, file.type, file.size);
    console.log("Cloudinary config:", process.env.CLOUDINARY_CLOUD_NAME ? "Cloud name exists" : "Missing cloud name");
    
    // Convert file to base64 instead of using streams
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;
    
    // Upload to Cloudinary with a simpler approach
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        dataURI,
        { 
          folder: 'globetrotter',
          resource_type: 'auto' 
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    
    // Return only the URL (no publicId)
    return NextResponse.json({ 
      url: uploadResult.secure_url,
      success: true 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 