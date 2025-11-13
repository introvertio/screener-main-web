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
    <div className="group flex flex-col gap-3 bg-white border border-black p-5 w-full max-w-sm items-center hover:bg-black transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-bold text-xl text-black group-hover:text-white">
          Screen {screen.index}
        </p>
        {screen.owner && (
          <span className="text-xs bg-white text-black group-hover:bg-white group-hover:text-black px-2 py-1 border border-black">
            {screen.owner}
          </span>
        )}
      </div>
      
      <div className="w-full flex justify-center mb-3">
        <video
          src={screen.video_url}
          className="border border-black max-h-40 w-full object-cover bg-black"
          controls
          preload="metadata"
        />
      </div>
      
      <div className="text-xs text-black group-hover:text-white text-center space-y-1 mb-3">
        <p>
          <span className="font-medium">Updated:</span>{" "}
          <span className="font-mono">{formatDateTime(screen.updated_at)}</span>
        </p>
        <p>
          <span className="font-medium">By:</span>{" "}
          <span className="font-semibold">{screen.updated_by}</span>
        </p>
      </div>
      
      <Link
        href={`/screens/${screen.index}`}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium border border-blue-600 w-full text-center text-sm"
      >
        Update Video
      </Link>
    </div>
  );
}
