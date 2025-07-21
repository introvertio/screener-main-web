"use client";
import { validateAuth } from "@/lib/validate";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTokenStore } from "./stores/useTokenStore";

export function useAuthGuard(redirectTo?: string) {
  const router = useRouter();
  const { token, setToken } = useTokenStore();
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const validateToken = async () => {
      if (typeof window === "undefined") return;

      if (!token) {
        router.replace("/");
        return;
      }

      const isValid = await validateAuth(token);
      if (!isValid) {
        setToken(null);
        router.replace("/");
      } else if (redirectTo) {
        router.replace(redirectTo);
      }
    };

    // Initial validation
    validateToken();
  }, [token, redirectTo, router, setToken]);
}
