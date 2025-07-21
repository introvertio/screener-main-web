"use client";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import React from "react";
import { useScreens } from "../components/hooks/useScreens";
import ScreenList from "../components/screens/ScreenList";

export default function ScreensPage() {
  useAuthGuard();
  const { data: screens, isLoading } = useScreens();
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-svw h-svh p-4">
      <p className="font-bold text-2xl">Screens</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          <ScreenList screen={screens?.[0]!} />
          <ScreenList screen={screens?.[1]!} />
          <ScreenList screen={screens?.[2]!} />
        </div>
      )}
    </div>
  );
}
