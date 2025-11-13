"use client";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import React from "react";
import { useScreens } from "../components/hooks/useScreens";
import ScreenList from "../components/screens/ScreenList";
import { Screen, ScreensByUser } from "@/lib/get-screens";

export default function ScreensPage() {
  useAuthGuard();
  const { data: screens, isLoading } = useScreens();
  const [activeTab, setActiveTab] = React.useState<string>("");

  // Helper function to check if screens is an array (regular user) or object (admin)
  const isScreenArray = (
    data: Screen[] | ScreensByUser | undefined
  ): data is Screen[] => {
    return Array.isArray(data);
  };

  // Set initial active tab when screens data loads
  React.useEffect(() => {
    if (screens && !isScreenArray(screens) && !activeTab) {
      const usernames = Object.keys(screens);
      if (usernames.length > 0) {
        setActiveTab(usernames[0]);
      }
    }
  }, [screens, activeTab]);

  // Helper function to render screen lists
  const renderScreens = () => {
    if (!screens) return null;

    if (isScreenArray(screens)) {
      // Regular user - screens is an array
      return screens.length > 0 ? (
        <div className="w-full max-w-7xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {screens.map((screen, idx) => (
              <ScreenList key={screen.index ?? idx + 1} screen={screen} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-black">No screens found</p>
        </div>
      );
    } else {
      // Admin user - tab system
      const usernames = Object.keys(screens);

      if (usernames.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-black">No screens found</p>
          </div>
        );
      }

      const activeUserScreens = activeTab ? screens[activeTab] || [] : [];

      return (
        <div className="w-full max-w-7xl">
          {/* Tab Navigation */}
          <div className="bg-white border border-black p-1 mb-6">
            <div className="flex flex-wrap gap-1">
              {usernames.map((username) => {
                const userScreens = screens[username];
                const isActive = activeTab === username;
                return (
                  <button
                    key={username}
                    onClick={() => setActiveTab(username)}
                    className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-black border-black bg-white hover:bg-black hover:text-white"
                    }`}
                  >
                    <span>{username}</span>
                    <span
                      className={`text-xs px-2 py-0.5 border ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-black border-black"
                      }`}
                    >
                      {userScreens.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content */}
          {activeUserScreens.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {activeUserScreens.map((screen, idx) => (
                <ScreenList key={screen.index ?? idx + 1} screen={screen} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-black">No screens found for {activeTab}</p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-svh bg-white p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-black mb-2">Screens</h1>
          <p className="text-black">Manage and view all screen videos</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-black border-t-blue-600"></div>
          </div>
        )}

        {!isLoading && renderScreens()}
      </div>
    </div>
  );
}
