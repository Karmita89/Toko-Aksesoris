import { Client } from "minio";

// Initialize MinIO client with environment variables
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: 9000,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin123",
});

/**
 * Ensure the MinIO bucket exists
 * Creates the bucket if it doesn't exist
 */
export async function ensureBucket(bucketName: string): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`✓ Bucket "${bucketName}" created successfully`);
    }
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
}

/**
 * Upload a file to MinIO bucket
 * @param bucketName - The name of the MinIO bucket
 * @param fileName - The name of the file to store (e.g., "products/image-123.jpg")
 * @param fileContent - The file buffer/stream
 * @param fileSize - The size of the file
 * @param contentType - The MIME type of the file
 * @returns The object name (path) in MinIO
 */
export async function uploadFile(
  bucketName: string,
  fileName: string,
  fileContent: Buffer,
  fileSize: number,
  contentType: string
): Promise<string> {
  try {
    // Ensure bucket exists before uploading
    await ensureBucket(bucketName);

    // Upload file to MinIO
    await minioClient.putObject(bucketName, fileName, fileContent, fileSize, {
      "Content-Type": contentType,
    });

    console.log(`✓ File uploaded: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Generate a URL for accessing the uploaded file
 * @param bucketName - The name of the MinIO bucket
 * @param fileName - The name of the file stored in MinIO
 * @returns The public URL to access the file
 */
export function getFileUrl(bucketName: string, fileName: string): string {
  // For local development with Docker, use the Docker service name
  const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
  return `${endpoint}/${bucketName}/${fileName}`;
}

/**
 * Delete a file from MinIO bucket
 * @param bucketName - The name of the MinIO bucket
 * @param fileName - The name of the file to delete
 */
export async function deleteFile(
  bucketName: string,
  fileName: string
): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, fileName);
    console.log(`✓ File deleted: ${fileName}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export default minioClient;
