import { useQuery } from "@tanstack/react-query";
import { getScreen } from "@/lib/get-screen";
import { useTokenStore } from "../stores/useTokenStore";

export const useScreen = (index: number) => {
  const { token } = useTokenStore();

  return useQuery({
    queryKey: ["screen", index],
    queryFn: async () => {
      if (token) {
        const screen = await getScreen(token, index);
        console.log("screen", screen);
        return screen;
      }
    },
    enabled: !!token,
  });
};
