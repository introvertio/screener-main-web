import { useEffect, useState } from "react";

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalled: boolean;
  isActive: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalled: false,
    isActive: false,
    registration: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return;
    }

    setState((prev) => ({ ...prev, isSupported: true }));

    const registerServiceWorker = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        setState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        // Listen for service worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                setState((prev) => ({ ...prev, isInstalled: true }));

                // Check if there's an update available
                if (navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  if (confirm("New version available! Reload to update?")) {
                    window.location.reload();
                  }
                }
              }
            });
          }
        });

        // Listen for service worker state changes
        if (registration.installing) {
          registration.installing.addEventListener("statechange", (e) => {
            const target = e.target as ServiceWorker;
            if (target.state === "installed") {
              setState((prev) => ({ ...prev, isInstalled: true }));
            } else if (target.state === "activated") {
              setState((prev) => ({ ...prev, isActive: true }));
            }
          });
        }

        // Check if service worker is already active
        if (registration.active) {
          setState((prev) => ({
            ...prev,
            isActive: true,
          }));
        }

        // Handle service worker messages
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.log("Message from service worker:", event.data);
        });

        // Handle service worker errors
        navigator.serviceWorker.addEventListener("error", (error) => {
          console.error("Service Worker error:", error);
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    // Register service worker when component mounts
    registerServiceWorker();

    // Cleanup function
    return () => {
      // Unregister service worker if needed
      // Note: Usually you don't want to unregister on unmount
    };
  }, []);

  // Function to manually check for updates
  const checkForUpdates = async () => {
    if (state.registration) {
      await state.registration.update();
    }
  };

  // Function to unregister service worker
  const unregister = async () => {
    if (state.registration) {
      await state.registration.unregister();
      setState((prev) => ({
        ...prev,
        isRegistered: false,
        isInstalled: false,
        isActive: false,
        registration: null,
      }));
    }
  };

  return {
    ...state,
    checkForUpdates,
    unregister,
  };
};
