"use client";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import React from "react";
import { useScreens } from "../components/hooks/useScreens";
import ScreenList from "../components/screens/ScreenList";
import { Screen, ScreensByUser } from "@/lib/get-screens";

export default function ScreensPage() {
  useAuthGuard();
  const { data: screens, isLoading } = useScreens();

  // Helper function to check if screens is an array (regular user) or object (admin)
  const isScreenArray = (
    data: Screen[] | ScreensByUser | undefined
  ): data is Screen[] => {
    return Array.isArray(data);
  };

  // Helper function to render screen lists
  const renderScreens = () => {
    if (!screens) return null;

    if (isScreenArray(screens)) {
      // Regular user - screens is an array
      return screens.length > 0 ? (
        <div className="flex flex-col gap-2">
          {screens.map((screen, idx) => (
            <ScreenList key={screen.index ?? idx + 1} screen={screen} />
          ))}
        </div>
      ) : (
        <p>No screens found</p>
      );
    } else {
      // Admin user - screens is an object grouped by user
      const allScreens: Screen[] = [];
      Object.entries(screens).forEach(([username, userScreens]) => {
        allScreens.push(...userScreens);
      });

      return allScreens.length > 0 ? (
        <div className="flex flex-col gap-4">
          {Object.entries(screens).map(([username, userScreens]) => (
            <div key={username} className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg text-gray-700">
                {username} ({userScreens.length} screen
                {userScreens.length !== 1 ? "s" : ""})
              </h3>
              <div className="flex flex-col gap-2 ml-4">
                {userScreens.map((screen, idx) => (
                  <ScreenList key={screen.index ?? idx + 1} screen={screen} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No screens found</p>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-svw minh-svh p-4 py-8">
      <p className="font-bold text-2xl">Screens</p>
      {isLoading && <p>Loading...</p>}
      {!isLoading && renderScreens()}
    </div>
  );
}
