import { useState, useCallback } from "react";
import { updateScreen } from "@/lib/update-screen";
import { useTokenStore } from "../stores/useTokenStore";

export function useUpdateScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = useTokenStore((s) => s.token);

  const mutate = useCallback(
    async (index: number, videoFile: File) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        await updateScreen(index, videoFile, token!);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { mutate, loading, error, success };
}
