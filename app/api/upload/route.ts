import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

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
    
    // In a real implementation, you would:
    // 1. Parse the FormData
    // 2. Get the file from the FormData
    // 3. Upload it to a storage service
    // 4. Return the URL
    
    // This is a placeholder implementation
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'globetrotter',
          public_id: `photo_${Date.now()}`, 
          resource_type: 'auto' 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      
      // Convert buffer to stream and pipe to uploadStream
      const readableInstance = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        }
      });
      
      readableInstance.pipe(uploadStream);
    });
    
    // Return only the secure_url - REMOVE publicId until database is migrated
    return NextResponse.json({ 
      url: result.secure_url,
      // Don't include public_id until database schema is updated
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