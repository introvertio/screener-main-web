"use client";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import React from "react";
import { useScreens } from "../components/hooks/useScreens";
import ScreenList from "../components/screens/ScreenList";

export default function ScreensPage() {
  useAuthGuard();
  const { data: screens, isLoading } = useScreens();
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-svw minh-svh p-4 py-8">
      <p className="font-bold text-2xl">Screens</p>
      {isLoading && <p>Loading...</p>}
      {!isLoading && screens && screens.length > 0 && (
        <div className="flex flex-col gap-2">
          {screens.map((screen, idx) => (
            <ScreenList key={screen.index ?? idx + 1} screen={screen} />
          ))}
        </div>
      )}
    </div>
  );
}
