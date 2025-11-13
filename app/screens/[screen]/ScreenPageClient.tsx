"use client";
import React, { Suspense } from "react";
import { useScreen } from "@/app/components/hooks/useScreen";
import { useAuthGuard } from "@/app/components/useAuthGuard";
import { useParams } from "next/navigation";

export default function ScreenPageClient() {
  useAuthGuard();
  const params = useParams();
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
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Handle fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && videoRef.current) {
        // If user exits fullscreen, pause the video
        videoRef.current.pause();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
    if (selectedFile && selectedFile.size > 1000 * 1024 * 1024) {
      setFile(null);
      setFileError("File size must be less than 1000MB.");
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

  if (isLoading)
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4 text-sm font-medium text-slate-500">
        Loading…
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4 text-sm font-medium text-red-600">
        Error loading screen.
      </div>
    );
  if (!screen)
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4 text-sm font-medium text-slate-500">
        No screen found.
      </div>
    );

  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4 text-sm font-medium text-slate-500">
          Loading…
        </div>
      }
    >
      <div className="min-h-svh w-full bg-slate-50 px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <div className="rounded-lg border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  Screen {screen.index}
                </p>
                <p className="text-sm text-slate-500">
                  Last updated by{" "}
                  <span className="font-medium text-slate-600">
                    {screen.updated_by}
                  </span>
                </p>
              </div>
              {screen.owner && (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {screen.owner}
                </span>
              )}
            </div>

            <div className="mb-6 flex flex-col gap-2 text-sm text-slate-500">
              <p>
                <span className="font-medium text-slate-600">Created:</span>{" "}
                <span className="font-mono text-xs">
                  {formatDateTime(screen.created_at)}
                </span>
              </p>
              <p>
                <span className="font-medium text-slate-600">Updated:</span>{" "}
                <span className="font-mono text-xs">
                  {formatDateTime(screen.updated_at)}
                </span>
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-900/5">
              <video
                ref={videoRef}
                src={screen.video_url}
                playsInline={false}
                className="max-h-[420px] w-full object-contain"
                controls
                autoPlay
                onClick={() => {
                  // Go fullscreen when video is clicked
                  if (!document.fullscreenElement) {
                    videoRef.current?.requestFullscreen().catch((err) => {
                      console.log("Fullscreen request failed:", err);
                    });
                  }
                }}
                onPlay={() => {
                  // Automatically go fullscreen when video starts playing
                  if (!document.fullscreenElement) {
                    videoRef.current?.requestFullscreen().catch((err) => {
                      console.log("Fullscreen request failed:", err);
                    });
                  }
                }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
          >
            <label className="flex w-full cursor-pointer flex-col gap-3">
              <span className="text-base font-medium text-slate-700">
                Upload new video (max 1000MB)
              </span>
              <input
                className="hidden"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={updating}
              />
              <div className="flex h-14 w-full items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-100/60 px-4 text-sm text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100">
                <span className="truncate">
                  {file ? file.name : "Choose a video file…"}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Browse
                </span>
              </div>
            </label>
            {fileError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {fileError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!file || updating || !!fileError}
              >
                {updating ? "Updating…" : "Update Video"}
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-50"
                onClick={() => {
                  setFile(null);
                  setFileError(null);
                }}
                disabled={updating}
              >
                Clear
              </button>
            </div>
            {updateError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {updateError}
              </p>
            )}
            {success && (
              <p className="mt-2 text-sm font-medium text-emerald-600">
                Video updated!
              </p>
            )}
          </form>
        </div>
      </div>
    </Suspense>
  );
}
