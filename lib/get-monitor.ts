import axios from "axios";
import { API_BASE_URL } from "./api";

export interface MonitorActiveSession {
  username: string;
  screen_index: number | null;
  status: "playing" | "browsing";
  owner: string;
  last_seen_at: string;
  seconds_since_seen: number;
  client_ip: string;
  hit_count: number;
  first_seen_at: string;
}

export interface MonitorScreenStatus {
  index: number;
  owner: string | null;
  status: "active" | "idle";
  last_seen_at: string | null;
}

export interface MonitorResponse {
  generated_at: string;
  active_window_seconds: number;
  viewer_is_staff: boolean;
  summary: {
    active_tvs: number;
    accounts_fetching: number;
    idle_screens: number;
  };
  active: MonitorActiveSession[];
  screens: MonitorScreenStatus[];
}

export const getMonitor = async (token: string): Promise<MonitorResponse> => {
  const response = await axios.get<MonitorResponse>(`${API_BASE_URL}/monitor/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
