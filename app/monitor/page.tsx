"use client";

import { useAuthGuard } from "@/app/components/useAuthGuard";
import { useMonitor } from "@/app/components/hooks/useMonitor";
import { useTokenStore } from "@/app/components/stores/useTokenStore";
import Link from "next/link";

function formatRelativeTime(seconds: number): string {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}

export default function MonitorPage() {
  useAuthGuard();
  const { data, isLoading, error, dataUpdatedAt, isFetching } = useMonitor();
  const { logout } = useTokenStore();

  const showAccountColumn = Boolean(data?.viewer_is_staff);

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-12 flex flex-col items-center">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-3xl font-semibold text-slate-900">Monitor</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span
                  className={`inline-block h-2 w-2 rounded-full bg-emerald-500 ${
                    isFetching ? "animate-pulse" : ""
                  }`}
                />
                Live
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Active means a fetch in the last{" "}
              {data?.active_window_seconds ?? 150} seconds.
            </p>
            {dataUpdatedAt ? (
              <p className="mt-1 text-xs text-slate-400">
                Updated {formatRelativeTime(Math.floor((Date.now() - dataUpdatedAt) / 1000))}
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/screens"
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 bg-white hover:bg-slate-100"
            >
              Screens
            </Link>
            <button
              onClick={() => logout()}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            Failed to load monitor data.
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-slate-200 bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Active TVs</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data.summary.active_tvs}
                </p>
              </div>
              <div className="border border-slate-200 bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Accounts fetching
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data.summary.accounts_fetching}
                </p>
              </div>
              <div className="border border-slate-200 bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Idle screens
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data.summary.idle_screens}
                </p>
              </div>
            </div>

            <div className="border border-slate-200 bg-white/90 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Active now
              </h2>
              {data.active.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">
                  No TVs are fetching right now.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        {showAccountColumn && (
                          <th className="pb-3 pr-4 font-medium">Account</th>
                        )}
                        <th className="pb-3 pr-4 font-medium">Activity</th>
                        <th className="pb-3 pr-4 font-medium">Last seen</th>
                        <th className="pb-3 font-medium">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.active.map((row, idx) => (
                        <tr
                          key={`${row.username}-${row.screen_index}-${row.client_ip}-${idx}`}
                          className="border-b border-slate-100 last:border-0"
                        >
                          {showAccountColumn && (
                            <td className="py-3 pr-4 font-medium text-slate-900">
                              {row.username}
                            </td>
                          )}
                          <td className="py-3 pr-4 text-slate-700">
                            {row.status === "playing"
                              ? `Playing screen ${row.screen_index}`
                              : "On the screen list"}
                          </td>
                          <td className="py-3 pr-4 text-slate-500">
                            {formatRelativeTime(row.seconds_since_seen)}
                          </td>
                          <td className="py-3 font-mono text-xs text-slate-500">
                            {row.client_ip || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border border-slate-200 bg-white/90 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                All screens
              </h2>
              {data.screens.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">
                  No screens found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 pr-4 font-medium">Screen</th>
                        {showAccountColumn && (
                          <th className="pb-3 pr-4 font-medium">Owner</th>
                        )}
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 font-medium">Last TV fetch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.screens.map((screen) => (
                        <tr
                          key={screen.index}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-3 pr-4 font-medium text-slate-900">
                            Screen {screen.index}
                          </td>
                          {showAccountColumn && (
                            <td className="py-3 pr-4 text-slate-700">
                              {screen.owner || "—"}
                            </td>
                          )}
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold ${
                                screen.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {screen.status === "active" ? "Active" : "Idle"}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">
                            {formatDateTime(screen.last_seen_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
