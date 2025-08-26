import { useState, useCallback } from "react";
import { updateScreen } from "@/lib/update-screen";
import { uploadVideoToBlob, type UploadProgress } from "@/lib/upload-to-blob";
import { useTokenStore } from "../stores/useTokenStore";

export function useUpdateScreen() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = useTokenStore((s) => s.token);

  const mutate = useCallback(
    async (index: number, videoFile: File) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setUploadProgress(null);

      try {
        // Step 1: Upload video to Vercel Blob with progress tracking
        const videoUrl = await uploadVideoToBlob(videoFile, (progress) => {
          setUploadProgress(progress);
        });

        // Step 2: Update screen with the blob URL
        await updateScreen(index, videoUrl, token!);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setUploadProgress(null);
      }
    },
    [token]
  );

  return {
    mutate,
    loading,
    uploadProgress,
    error,
    success,
  };
}
