"use client";

import { login } from "@/lib/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "./components/hooks/useLogin";
import { ServiceWorkerStatus } from "./components/ServiceWorkerStatus";
import Image from "next/image";
import { useAuthGuard } from "./components/useAuthGuard";

export default function Home() {
  useAuthGuard();
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
      className={`h-svh w-svw flex flex-col gap-4 justify-center items-center p-4 relative`}
    >
      <Image
        className="object-contain p-2 bg-blue-600"
        src="/cover.png"
        alt="logo"
        width={400}
        height={200}
      />

      <p className={`text-2xl font-bold text-black`}>SIL Screener Login</p>
      <div className={`flex flex-col gap-2 w-full max-w-md`}>
        <p className={`text-xs font-bold text-black`}>Username</p>
        <input
          className={`w-full border border-black p-3 text-base bg-white text-black focus:outline-none focus:border-blue-600`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
        />
      </div>
      <div className={`flex flex-col gap-2 w-full max-w-md`}>
        <p className={`text-xs font-bold text-black`}>Password</p>
        <input
          className={`w-full border border-black p-3 text-base bg-white text-black focus:outline-none focus:border-blue-600`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      {login.error ? (
        <p className={`text-red-600 text-center w-full max-w-md text-sm`}>
          {login.error.message}
        </p>
      ) : null}
      <button
        className={`w-full max-w-md bg-blue-600 p-3 flex-row items-center justify-center border border-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={handleLogin}
        disabled={login.isPending}
      >
        <p className={`text-white text-center text-base font-bold`}>
          {login.isPending ? "Logging in..." : "Login"}
        </p>
      </button>
    </div>
  );
}
