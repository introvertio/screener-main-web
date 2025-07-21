import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/lib/login";
import { useTokenStore } from "../stores/useTokenStore";

export function useLogin() {
  const { setToken } = useTokenStore();

  const login = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return await loginApi(username, password);
    },
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    login,
  };
}
