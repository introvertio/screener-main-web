"use client";

import { createContext, useContext, ReactNode } from "react";
import { useServiceWorker } from "./hooks/useServiceWorker";

interface ServiceWorkerContextType {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalled: boolean;
  isActive: boolean;
  checkForUpdates: () => Promise<void>;
  unregister: () => Promise<void>;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(
  null
);

export const useServiceWorkerContext = () => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error(
      "useServiceWorkerContext must be used within a ServiceWorkerProvider"
    );
  }
  return context;
};

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

export const ServiceWorkerProvider = ({
  children,
}: ServiceWorkerProviderProps) => {
  const serviceWorkerState = useServiceWorker();

  return (
    <ServiceWorkerContext.Provider value={serviceWorkerState}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};
