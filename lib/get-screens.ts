import axios from "axios";
import { API_BASE_URL } from "./api";

export interface Screen {
  index: number;
  video_url: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export const getScreens = async (token: string): Promise<Screen[]> => {
  const response = await axios.get<{ screens: Screen[] }>(
    `${API_BASE_URL}/screens/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.screens;
};
