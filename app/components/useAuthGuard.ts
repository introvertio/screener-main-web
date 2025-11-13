"use client";
import { validateAuth } from "@/lib/validate";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTokenStore } from "./stores/useTokenStore";

export function useAuthGuard(redirectTo?: string) {
  const router = useRouter();
  const { token, setToken } = useTokenStore();
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pathname = usePathname();
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
      }
      if (isValid) {
        if (pathname === "/") {
          router.replace("/screens");
        }
      }
    };

    // Initial validation
    validateToken();
  }, [token, redirectTo, router, setToken]);
}
