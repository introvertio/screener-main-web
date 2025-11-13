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
        <div className="w-full max-w-6xl">
          <div className="flex flex-wrap justify-center gap-6">
            {screens.map((screen, idx) => (
              <ScreenList key={screen.index ?? idx + 1} screen={screen} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-500">No screens found</p>
        </div>
      );
    } else {
      // Admin user - tab system
      const usernames = Object.keys(screens);

      if (usernames.length === 0) {
        return (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              No screens found
            </p>
          </div>
        );
      }

      const activeUserScreens = activeTab ? screens[activeTab] || [] : [];

      return (
        <div className="w-full max-w-6xl space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <div className="inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur-sm">
              {usernames.map((username) => {
                const userScreens = screens[username];
                const isActive = activeTab === username;
                return (
                  <button
                    key={username}
                    onClick={() => setActiveTab(username)}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{username}</span>
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
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
            <div className="flex flex-wrap justify-center gap-6">
              {activeUserScreens.map((screen, idx) => (
                <ScreenList key={screen.index ?? idx + 1} screen={screen} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                No screens found for{" "}
                <span className="font-semibold">{activeTab}</span>
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-semibold text-slate-900">
            Screens
          </h1>
          <p className="text-sm text-slate-500">
            Manage and review your latest screen recordings in one place.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          </div>
        )}

        {!isLoading && renderScreens()}
      </div>
    </div>
  );
}
