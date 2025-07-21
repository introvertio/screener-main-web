import { Screen } from "@/lib/get-screens";
import React from "react";

interface ScreenListProps {
  screen: Screen;
}

export default function ScreenList({ screen }: ScreenListProps) {
  return (
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
  );
}
