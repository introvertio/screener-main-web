import { upload } from "@vercel/blob/client";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadVideoToBlob(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith("video/")) {
      throw new Error("File must be a video");
    }

    // Note: The blob token is configured on the server-side for security
    // The client uses handleUploadUrl for token exchange

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `videos/${timestamp}-${file.name}`;

    // Upload directly to Vercel Blob using client-side upload
    // Files are uploaded directly from browser to Vercel Blob after token exchange
    const blob = await upload(fileName, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      multipart: true,
      onUploadProgress: onProgress
        ? (progress) => {
            onProgress({
              loaded: progress.loaded,
              total: progress.total,
              percentage: Math.round((progress.loaded / progress.total) * 100),
            });
          }
        : undefined,
    });

    return blob.url;
  } catch (error: any) {
    console.error("Failed to upload video to blob:", error);
    throw new Error(error?.message || "Failed to upload video to Vercel Blob");
  }
}

export async function deleteVideoFromBlob(url: string): Promise<void> {
  try {
    const { del } = await import("@vercel/blob");

    // Note: del() function uses server-side environment variables automatically
    // when called from server-side code (API routes, server actions, etc.)
    await del(url);
  } catch (error: any) {
    console.error("Failed to delete video from blob:", error);
    throw new Error("Failed to delete video from Vercel Blob");
  }
}
