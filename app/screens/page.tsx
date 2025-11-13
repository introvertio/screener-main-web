"use client";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import React from "react";
import { useScreens } from "../components/hooks/useScreens";
import ScreenList from "../components/screens/ScreenList";
import { Screen, ScreensByUser } from "@/lib/get-screens";

export default function ScreensPage() {
  useAuthGuard();
  const { data: screens, isLoading } = useScreens();
  const [expandedUsers, setExpandedUsers] = React.useState<Set<string>>(
    new Set()
  );

  // Helper function to check if screens is an array (regular user) or object (admin)
  const isScreenArray = (
    data: Screen[] | ScreensByUser | undefined
  ): data is Screen[] => {
    return Array.isArray(data);
  };

  // Toggle user dropdown expansion
  const toggleUser = (username: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
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
        <div className="flex flex-col gap-3 w-full max-w-4xl">
          {Object.entries(screens).map(([username, userScreens]) => {
            const isExpanded = expandedUsers.has(username);
            return (
              <div
                key={username}
                className="bg-white/90 rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleUser(username)}
                  className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`transform transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                      {username}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                    {userScreens.length} screen
                    {userScreens.length !== 1 ? "s" : ""}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-6 pt-4 bg-white">
                    <div className="flex flex-col gap-4">
                      {userScreens.map((screen, idx) => (
                        <ScreenList
                          key={screen.index ?? idx + 1}
                          screen={screen}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No screens found</p>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center w-svw min-h-svh p-4 py-8">
      <p className="font-bold text-2xl">Screens</p>
      {isLoading && <p>Loading...</p>}
      {!isLoading && renderScreens()}
    </div>
  );
}
