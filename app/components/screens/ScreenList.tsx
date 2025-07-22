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
    <div className="flex flex-col gap-3 bg-white/80 shadow-lg rounded-xl p-6 w-full max-w-md items-center border border-blue-100 hover:shadow-2xl transition-shadow duration-200">
      <p className="font-bold text-2xl text-blue-700 mb-1">
        Screen {screen.index}
      </p>
      <p className="text-xs text-gray-500 mb-1">
        Created at:{" "}
        <span className="font-mono">{formatDateTime(screen.created_at)}</span>
        <br />
        Updated at:{" "}
        <span className="font-mono">{formatDateTime(screen.updated_at)}</span>
      </p>
      <p className="text-xs text-gray-600 mb-2">
        Updated by: <span className="font-semibold">{screen.updated_by}</span>
      </p>
      <div className="w-full flex justify-center mb-2">
        <video
          src={screen.video_url}
          className="rounded-lg border shadow-md max-h-48 max-w-full object-contain bg-black"
          controls
        />
      </div>
      <Link
        href={`/screens/${screen.index}`}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold shadow transition-colors w-full text-center"
      >
        Update Video
      </Link>
    </div>
  );
}
