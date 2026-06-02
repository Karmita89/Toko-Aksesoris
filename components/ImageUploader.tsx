"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * ImageUploader Component
 * - Allows users to select and upload images
 * - Shows preview of selected image
 * - Displays uploaded image URL
 * - Beginner-friendly with clear feedback
 */
export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  /**
   * Handle file selection
   * Creates a preview of the selected image
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Show error if file is not an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      setSelectedFile(null);
      setPreview("");
      return;
    }

    // Show error if file is too large
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setSelectedFile(null);
      setPreview("");
      return;
    }

    // Reset error and success messages
    setError("");
    setSuccess(false);

    // Store file and create preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle file upload to the server
   */
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Show success message
      setSuccess(true);
      setUploadedUrl(data.url);
      setSelectedFile(null);
      setPreview("");

      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setUploadedUrl("");
      }, 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Image</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer block text-gray-600 hover:text-blue-500 transition"
          >
            {selectedFile ? (
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Click to select image</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
              </div>
            )}
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Preview:</p>
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && uploadedUrl && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded space-y-2">
            <p className="font-semibold">✓ Upload successful!</p>
            <p className="text-sm break-words">URL: {uploadedUrl}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : selectedFile
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Max file size: 5MB • Supported: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
