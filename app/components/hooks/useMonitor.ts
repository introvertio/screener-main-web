import { useQuery } from "@tanstack/react-query";
import { getMonitor } from "@/lib/get-monitor";
import { useTokenStore } from "../stores/useTokenStore";

export const useMonitor = () => {
  const { token } = useTokenStore();

  return useQuery({
    queryKey: ["monitor"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No token available");
      }
      return await getMonitor(token);
    },
    enabled: !!token,
    refetchInterval: 15000,
  });
};
