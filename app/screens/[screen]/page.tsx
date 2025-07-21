"use client";
import React from "react";
import { useScreen } from "@/app/components/hooks/useScreen";
import { useAuthGuard } from "@/app/components/useAuthGuard";
interface ScreenPageProps {
  params: { screen: string };
}

export default function ScreenPage({ params }: ScreenPageProps) {
  useAuthGuard();
  const index = Number(params.screen);
  const { data: screen, isLoading, error, refetch } = useScreen(index);
  const {
    mutate,
    loading: updating,
    error: updateError,
    success,
  } = require("@/app/components/hooks/useUpdateScreen").useUpdateScreen();
  const [file, setFile] = React.useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await mutate(index, file);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading screen.</div>;
  if (!screen) return <div>No screen found.</div>;

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-svw h-svh p-4">
      <div
        className="
    flex flex-col gap-2"
      >
        <p className="font-bold text-2xl">Screen {screen.index}</p>
        <p className="text-sm text-gray-500">
          Created at: {screen.created_at} - Updated at: {screen.updated_at}
        </p>
        <p className="text-sm">Updated by: {screen.updated_by}</p>
        <video src={screen.video_url} className="size-50 object-contain" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 items-center"
      >
        <input
          className="bg-blue-500 text-white px-4 py-2 rounded w-full h-10"
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={updating}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file || updating}
        >
          {updating ? "Updating..." : "Update Video"}
        </button>
        {updateError && <p className="text-red-500">{updateError}</p>}
        {success && <p className="text-green-500">Video updated!</p>}
      </form>
    </div>
  );
}
