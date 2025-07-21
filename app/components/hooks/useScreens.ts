import { useQuery } from "@tanstack/react-query";
import { getScreens } from "@/lib/get-screens";
import { useTokenStore } from "../stores/useTokenStore";

export const useScreens = () => {
  const { token } = useTokenStore();

  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      if (token) {
        const screens = await getScreens(token);
        console.log("screens", screens);
        return screens;
      }
    },
    enabled: !!token,
  });
};
