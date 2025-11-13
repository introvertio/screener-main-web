import axios from "axios";
import { API_BASE_URL } from "./api";

export interface Screen {
  index: number;
  video_url: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  owner?: string; // Optional for screen lists, required for individual screen
}

export interface ScreensByUser {
  [username: string]: Screen[];
}

export interface AdminScreensResponse {
  screens_by_user: ScreensByUser;
}

export interface RegularScreensResponse {
  screens: Screen[];
}

export const getScreens = async (
  token: string
): Promise<Screen[] | ScreensByUser> => {
  const response = await axios.get<
    AdminScreensResponse | RegularScreensResponse
  >(`${API_BASE_URL}/screens`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Check if response is for admin (has screens_by_user) or regular user (has screens)
  if ("screens_by_user" in response.data) {
    return response.data.screens_by_user;
  } else {
    return response.data.screens;
  }
};
