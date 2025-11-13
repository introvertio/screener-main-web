import { Screen } from "@/lib/get-screens";
import Link from "next/link";
import React from "react";

interface ScreenListProps {
  screen: Screen;
}

export default function ScreenList({ screen }: ScreenListProps) {
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
  return (
    <div className="group flex w-full max-w-sm flex-col gap-4 rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
      <div className="flex w-full items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">Screen {screen.index}</p>
          <p className="text-sm text-slate-500">
            Updated by <span className="font-medium text-slate-600">{screen.updated_by}</span>
          </p>
        </div>
        {screen.owner && (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-slate-300 group-hover:bg-slate-200">
            {screen.owner}
          </span>
        )}
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900/5">
        <video
          src={screen.video_url}
          className="h-44 w-full object-cover"
          controls
          preload="metadata"
        />
      </div>

      <div className="flex w-full items-center justify-between text-sm text-slate-500">
        <span className="font-medium text-slate-600">Updated</span>
        <span className="font-mono text-xs text-slate-500">{formatDateTime(screen.updated_at)}</span>
      </div>

      <Link
        href={`/screens/${screen.index}`}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Update Video
      </Link>
    </div>
  );
}
