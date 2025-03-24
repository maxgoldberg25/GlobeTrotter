import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
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
    // Enhanced environment variable logging
    console.log('Environment check:');
    console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
    
    // Verify environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Cloudinary credentials not configured' },
        { status: 500 }
      );
    }
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Authentication required' }, { status: 401 });
    }
    
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ error: 'No file provided', details: 'Please select a file to upload' }, { status: 400 });
      }
      
      console.log("File received:", file.name, file.type, file.size);
      
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64Data}`;
      
      console.log("File converted to base64, length:", dataURI.length);
      
      // Upload to Cloudinary with error handling
      try {
        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            { 
              folder: 'globetrotter',
              resource_type: 'auto' 
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else if (!result) {
                console.error("Cloudinary returned empty result");
                reject(new Error("Empty result from Cloudinary"));
              } else {
                console.log("Cloudinary upload success:", result.public_id);
                resolve(result as CloudinaryUploadResult);
              }
            }
          );
        });
        
        // Return more information for debugging if needed
        return NextResponse.json({ 
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          success: true 
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary error details:", cloudinaryError);
        return NextResponse.json(
          { error: 'Cloudinary upload failed', details: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error' },
          { status: 500 }
        );
      }
    } catch (requestError) {
      console.error("Request processing error:", requestError);
      return NextResponse.json(
        { error: 'Failed to process request', details: requestError instanceof Error ? requestError.message : 'Unknown request error' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 