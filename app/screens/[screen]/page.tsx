"use client";
import React, { Suspense } from "react";
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
  const [fileError, setFileError] = React.useState<string | null>(null);

  // Custom date formatting function
  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${hours}:${minutesStr}${ampm} ${dayOfWeek} ${day}${daySuffix} ${month} ${year}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.size > 4 * 1024 * 1024) {
      setFile(null);
      setFileError("File size must be less than 4MB.");
    } else {
      setFile(selectedFile);
      setFileError(null);
    }
  };

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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-8 items-center justify-center w-svw h-svh p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col gap-4 bg-white/80 shadow-xl rounded-xl p-8 w-full max-w-md items-center">
          <p className="font-bold text-3xl text-blue-700 mb-2">
            Screen {screen.index}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Created at:{" "}
            <span className="font-mono">
              {formatDateTime(screen.created_at)}
            </span>
            <br />
            Updated at:{" "}
            <span className="font-mono">
              {formatDateTime(screen.updated_at)}
            </span>
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Updated by:{" "}
            <span className="font-semibold">{screen.updated_by}</span>
          </p>
          <div className="w-full flex justify-center mb-2">
            <video
              src={screen.video_url}
              className="rounded-lg border shadow-md max-h-64 max-w-full object-contain bg-black"
              controls
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center bg-white/80 shadow-lg rounded-xl p-6 w-full max-w-md"
        >
          <label className="w-full flex flex-col items-center cursor-pointer">
            <span className="mb-2 text-base font-medium text-blue-700">
              Upload new video (max 4MB)
            </span>
            <input
              className="hidden"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={updating}
            />
            <div className="w-full h-12 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-blue-500 text-sm">
                {file ? file.name : "Choose a video file..."}
              </span>
            </div>
          </label>
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow disabled:opacity-50 transition-colors"
            disabled={!file || updating || !!fileError}
          >
            {updating ? "Updating..." : "Update Video"}
          </button>
          {updateError && (
            <p className="text-red-500 text-center text-sm mt-1">
              {updateError}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center text-sm mt-1">
              Video updated!
            </p>
          )}
        </form>
      </div>
    </Suspense>
  );
}
