import { NextRequest, NextResponse } from "next/server";
import { uploadFile, getFileUrl, ensureBucket } from "@/lib/minio";

/**
 * POST /api/upload
 * Accepts multipart/form-data with image file
 * Uploads to MinIO and returns image URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validation: Check if file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validation: Check file size (limit to 5MB for images)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validation: Check file type (only images)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.split(".")[0];
    const fileExtension = file.name.split(".").pop();
    const fileName = `images/${originalName}-${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Ensure bucket exists
    const bucketName = process.env.MINIO_BUCKET_NAME || "akschim-images";
    await ensureBucket(bucketName);

    // Upload to MinIO
    await uploadFile(
      bucketName,
      fileName,
      fileBuffer,
      file.size,
      file.type
    );

    // Generate and return the public URL
    const fileUrl = getFileUrl(bucketName, fileName);

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        url: fileUrl,
        fileName: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
