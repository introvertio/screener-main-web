"use client";

import { MonitorActiveSession } from "@/lib/get-monitor";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { Power } from "@phosphor-icons/react/dist/ssr/Power";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ScreenFaceMode = "playing" | "browsing" | "idle";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function ScreenFace({
  mode,
  videoUrl,
  screenIndex,
  animate = false,
}: {
  mode: ScreenFaceMode;
  videoUrl?: string;
  screenIndex?: number | null;
  animate?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = mode === "playing" && Boolean(videoUrl) && !videoFailed;
  const playMotion = animate && !reduced;

  if (mode === "browsing") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-800 px-3 text-center text-slate-100">
        <SquaresFour size={32} aria-hidden />
        <p className="text-sm font-medium">Screen list</p>
      </div>
    );
  }

  if (mode === "idle") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-950 text-slate-500">
        <Power size={26} aria-hidden />
        <p className="text-3xl font-semibold tabular-nums text-slate-400">
          {screenIndex ?? ""}
        </p>
      </div>
    );
  }

  if (!showVideo) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 text-white">
        <Play size={22} weight="fill" className="text-emerald-400" aria-hidden />
        <p className="text-4xl font-semibold tabular-nums">{screenIndex ?? ""}</p>
      </div>
    );
  }

  return (
    <>
      <video
        key={videoUrl}
        className="pointer-events-none h-full w-full object-cover"
        src={playMotion ? videoUrl : `${videoUrl}#t=0.1`}
        muted
        playsInline
        autoPlay={playMotion}
        loop={playMotion}
        preload={playMotion ? "auto" : "metadata"}
        onError={() => setVideoFailed(true)}
        aria-hidden
      />
      <span className="absolute left-2 top-2 bg-slate-950/80 p-1 text-emerald-400">
        <Play size={14} weight="fill" aria-hidden />
      </span>
    </>
  );
}

export function TvFrame({
  lit,
  caption,
  lines,
  href,
  compact = false,
  children,
}: {
  lit: boolean;
  caption: string;
  lines: { text: string; mono?: boolean }[];
  href?: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  const body = (
    <div className="flex w-full flex-col items-center">
      <div className={`w-full bg-slate-900 shadow-sm ${compact ? "p-1.5" : "p-2.5"}`}>
        <div className="relative aspect-video overflow-hidden bg-slate-950">
          {children}
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
              lit ? "text-emerald-300" : "text-slate-300"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 ${
                lit ? "bg-emerald-400" : "bg-slate-600"
              }`}
              aria-hidden
            />
            {lit ? "On" : "Off"}
          </span>
          <span className="text-[10px] font-medium text-slate-400" aria-hidden>
            Sil
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center" aria-hidden>
        <div className={`bg-slate-900 ${compact ? "h-2 w-6" : "h-3 w-10"}`} />
        <div className={`bg-slate-700 ${compact ? "h-1 w-12" : "h-1.5 w-16"}`} />
      </div>
      <div className="mt-3 w-full text-center">
        <p className={`font-semibold text-slate-900 ${compact ? "text-sm" : "text-base"}`}>
          {caption}
        </p>
        {lines.map((line, index) => (
          <p
            key={`${line.text}-${index}`}
            className={
              line.mono
                ? "break-all font-mono text-[11px] text-slate-500"
                : "text-xs text-slate-500"
            }
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );

  if (!href) return body;

  return (
    <Link
      href={href}
      className="block w-full transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-none"
    >
      {body}
    </Link>
  );
}

export function TvSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex w-full flex-col items-center gap-3" aria-hidden>
      <div className={`w-full bg-slate-200 ${compact ? "p-1.5" : "p-2.5"}`}>
        <div className="aspect-video animate-pulse bg-slate-300 motion-reduce:animate-none" />
        <div className="mt-2 h-3 w-8 bg-slate-300" />
      </div>
      <div className="h-3 w-8 bg-slate-300" />
      <div className="h-1.5 w-16 bg-slate-300" />
      <div className="h-4 w-24 animate-pulse bg-slate-200 motion-reduce:animate-none" />
    </div>
  );
}

export function sessionHref(row: MonitorActiveSession): string {
  if (row.status === "playing" && row.screen_index != null) {
    return `/screens/${row.screen_index}`;
  }
  return "/screens";
}
