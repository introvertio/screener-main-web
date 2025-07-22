"use client";

import { login } from "@/lib/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "./components/hooks/useLogin";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { login } = useLogin();

  const handleLogin = async () => {
    const res = await login.mutateAsync({ username, password });

    if (res.token) {
      router.replace("/screens");
    }
  };

  return (
    <div
      className={`h-svh w-svw flex flex-col gap-3 justify-center items-center p-4`}
    >
      <p className={`text-2xl font-bold`}>Login</p>
      <div className={`flex flex-col gap-2 w-full`}>
        <p className={`text-xs font-bold text-black/50`}>Username</p>
        <input
          className={`w-full border-2 border-gray-300 rounded-md p-2 text-xl`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
        />
      </div>
      <div className={`flex flex-col gap-2 w-full`}>
        <p className={`text-xs font-bold text-black/50`}>Password</p>
        <input
          className={`w-full border-2 border-gray-300 rounded-md p-2 text-xl`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      {login.error ? (
        <p className={`text-red-500 text-center w-full`}>
          {login.error.message}
        </p>
      ) : null}
      <button
        className={`w-full bg-blue-500 rounded-md p-2 flex-row items-center justify-center`}
        onClick={handleLogin}
        disabled={login.isPending}
      >
        <p className={`text-white text-center text-xl font-bold`}>
          {login.isPending ? "Logging in..." : "Login"}
        </p>
      </button>
    </div>
  );
}
