"use client";

import { useAuthGuard } from "@/app/components/useAuthGuard";
import { useMonitor } from "@/app/components/hooks/useMonitor";
import { useScreens } from "@/app/components/hooks/useScreens";
import {
  ScreenFace,
  TvFrame,
  TvSkeleton,
  sessionHref,
} from "@/app/components/monitor/TvSet";
import { useTokenStore } from "@/app/components/stores/useTokenStore";
import {
  MonitorActiveSession,
  MonitorScreenStatus,
} from "@/lib/get-monitor";
import { Screen, ScreensByUser } from "@/lib/get-screens";
import { Monitor } from "@phosphor-icons/react/dist/ssr/Monitor";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { Power } from "@phosphor-icons/react/dist/ssr/Power";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { Television } from "@phosphor-icons/react/dist/ssr/Television";
import { Users } from "@phosphor-icons/react/dist/ssr/Users";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import Link from "next/link";

function formatRelativeTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  if (safe < 5) return "just now";
  if (safe < 60) return `${safe}s ago`;
  const minutes = Math.floor(safe / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatShort(dateString: string | null): string {
  if (!dateString) return "No fetch yet";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No fetch yet";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fetchLabel(count: number): string {
  return count === 1 ? "1 fetch" : `${count} fetches`;
}

function videoUrlByIndex(
  data: Screen[] | ScreensByUser | undefined
): Map<number, string> {
  const map = new Map<number, string>();
  if (!data) return map;
  const list = Array.isArray(data) ? data : Object.values(data).flat();
  for (const screen of list) {
    if (screen.video_url) map.set(screen.index, screen.video_url);
  }
  return map;
}

function viewersByScreen(
  active: MonitorActiveSession[]
): Map<number, MonitorActiveSession[]> {
  const map = new Map<number, MonitorActiveSession[]>();
  for (const row of active) {
    if (row.status !== "playing" || row.screen_index == null) continue;
    const list = map.get(row.screen_index) ?? [];
    list.push(row);
    map.set(row.screen_index, list);
  }
  return map;
}

function screenGroups(screens: MonitorScreenStatus[], showAccount: boolean) {
  if (!showAccount) {
    return [{ key: "all", label: null as string | null, items: screens }];
  }

  const order: string[] = [];
  const map = new Map<string, MonitorScreenStatus[]>();
  for (const screen of screens) {
    const label = screen.owner || "Unassigned";
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(screen);
  }

  if (order.length <= 1) {
    return [{ key: "all", label: null, items: screens }];
  }

  return order.map((label) => ({
    key: label,
    label,
    items: map.get(label) ?? [],
  }));
}

export default function MonitorPage() {
  useAuthGuard();
  const { data, isLoading, error, dataUpdatedAt, isFetching } = useMonitor();
  const { data: screenCatalog } = useScreens();
  const { logout } = useTokenStore();

  const showAccount = Boolean(data?.viewer_is_staff);
  const videos = videoUrlByIndex(screenCatalog);
  const viewers = data ? viewersByScreen(data.active) : new Map();
  const groups = data ? screenGroups(data.screens, showAccount) : [];

  const stats = data
    ? [
        {
          label: "TVs on",
          value: data.summary.active_tvs,
          Icon: Television,
        },
        {
          label: "Accounts fetching",
          value: data.summary.accounts_fetching,
          Icon: Users,
        },
        {
          label: "Idle screens",
          value: data.summary.idle_screens,
          Icon: Power,
        },
      ]
    : [];

  return (
    <div className="flex min-h-svh flex-col items-center bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Television size={28} className="text-slate-900" aria-hidden />
              <h1 className="text-3xl font-semibold text-slate-900">Monitor</h1>
              <span className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span
                  className={`inline-block h-2 w-2 bg-emerald-500 ${
                    isFetching ? "motion-safe:animate-pulse" : ""
                  }`}
                  aria-hidden
                />
                Live
              </span>
            </div>
            <p className="max-w-xl text-sm text-slate-500">
              Each set is a TV, and the picture is the screen it is playing. On
              means the TV fetched in the last {data?.active_window_seconds ?? 150}{" "}
              seconds.
            </p>
            {dataUpdatedAt ? (
              <p className="mt-1 text-xs text-slate-400">
                Updated{" "}
                {formatRelativeTime(Math.floor((Date.now() - dataUpdatedAt) / 1000))}
              </p>
            ) : null}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
              <li className="inline-flex items-center gap-1.5">
                <Play size={14} weight="fill" className="text-emerald-600" aria-hidden />
                Playing a screen
              </li>
              <li className="inline-flex items-center gap-1.5">
                <SquaresFour size={14} aria-hidden />
                On the screen list
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Power size={14} aria-hidden />
                Idle, no TV fetching
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/screens"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Monitor size={16} aria-hidden />
              Screens
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-2 bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <SignOut size={16} aria-hidden />
              Logout
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-10">
            <div className="grid border border-slate-200 bg-white sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className={`px-5 py-4 ${
                    item > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""
                  }`}
                >
                  <div className="h-8 w-12 animate-pulse bg-slate-200 motion-reduce:animate-none" />
                  <div className="mt-2 h-3 w-24 bg-slate-200" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TvSkeleton />
              <TvSkeleton />
              <TvSkeleton />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            <Warning size={18} aria-hidden />
            Failed to load monitor data.
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="space-y-10">
            <div className="grid border border-slate-200 bg-white sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    index > 0
                      ? "border-t border-slate-200 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <stat.Icon size={22} className="text-slate-700" aria-hidden />
                  <div>
                    <p className="text-2xl font-semibold tabular-nums text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                On right now
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {data.active.length}
                </span>
              </h2>
              {data.active.length === 0 ? (
                <div className="max-w-sm">
                  <TvFrame
                    lit={false}
                    caption="Nothing on"
                    lines={[{ text: "No TV has fetched recently" }]}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-950 text-slate-500">
                      <Television size={36} aria-hidden />
                      <p className="text-sm">All sets are off</p>
                    </div>
                  </TvFrame>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {data.active.map((row, index) => (
                    <TvFrame
                      key={`${row.username}-${row.screen_index}-${row.client_ip}-${index}`}
                      lit
                      href={sessionHref(row)}
                      caption={
                        row.status === "playing" && row.screen_index != null
                          ? `Screen ${row.screen_index}`
                          : "Screen list"
                      }
                      lines={[
                        ...(showAccount ? [{ text: row.username }] : []),
                        {
                          text: `Seen ${formatRelativeTime(row.seconds_since_seen)}`,
                        },
                        { text: fetchLabel(row.hit_count) },
                        { text: row.client_ip || "No IP", mono: true },
                      ]}
                    >
                      <ScreenFace
                        mode={row.status === "playing" ? "playing" : "browsing"}
                        screenIndex={row.screen_index}
                        videoUrl={
                          row.screen_index != null
                            ? videos.get(row.screen_index)
                            : undefined
                        }
                        animate={row.status === "playing"}
                      />
                    </TvFrame>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                All screens
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {data.screens.length}
                </span>
              </h2>
              {data.screens.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">No screens yet.</p>
              ) : (
                <div className="space-y-8">
                  {groups.map((group) => (
                    <div key={group.key}>
                      {group.label ? (
                        <h3 className="mb-4 text-sm font-medium text-slate-700">
                          {group.label}
                          <span className="ml-2 text-slate-400">
                            {group.items.length}
                          </span>
                        </h3>
                      ) : null}
                      <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                        {group.items.map((screen) => {
                          const tuned = viewers.get(screen.index) ?? [];
                          const lines: { text: string; mono?: boolean }[] = [];
                          if (showAccount && !group.label) {
                            lines.push({ text: screen.owner || "Unassigned" });
                          }
                          if (screen.status === "active") {
                            if (tuned.length === 1) {
                              if (
                                showAccount &&
                                tuned[0].username !== screen.owner
                              ) {
                                lines.push({ text: tuned[0].username });
                              }
                              lines.push({
                                text: `Seen ${formatRelativeTime(tuned[0].seconds_since_seen)}`,
                              });
                            } else if (tuned.length > 1) {
                              lines.push({ text: `${tuned.length} TVs` });
                            } else {
                              lines.push({ text: "On now" });
                            }
                          } else {
                            lines.push({ text: "Idle" });
                            lines.push({ text: formatShort(screen.last_seen_at) });
                          }

                          return (
                            <TvFrame
                              key={screen.index}
                              compact
                              lit={screen.status === "active"}
                              href={`/screens/${screen.index}`}
                              caption={`Screen ${screen.index}`}
                              lines={lines}
                            >
                              <ScreenFace
                                mode={screen.status === "active" ? "playing" : "idle"}
                                screenIndex={screen.index}
                                videoUrl={videos.get(screen.index)}
                              />
                            </TvFrame>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
