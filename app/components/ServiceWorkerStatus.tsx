"use client";

import { useServiceWorkerContext } from "./ServiceWorkerProvider";

export const ServiceWorkerStatus = () => {
  const {
    isSupported,
    isRegistered,
    isInstalled,
    isActive,
    checkForUpdates,
    unregister,
  } = useServiceWorkerContext();

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm">
        Service Worker not supported
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
      <div className="flex items-center gap-2">
        <span>
          SW:{" "}
          {isActive ? "🟢" : isInstalled ? "🟡" : isRegistered ? "🟠" : "🔴"}
        </span>
        <button
          onClick={checkForUpdates}
          className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs hover:bg-opacity-30"
        >
          Update
        </button>
        <button
          onClick={unregister}
          className="bg-red-500 px-2 py-1 rounded text-xs hover:bg-red-600"
        >
          Unregister
        </button>
      </div>
    </div>
  );
};
