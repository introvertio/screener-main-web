import axios from "axios";
import { API_BASE_URL } from "./api";

export async function updateScreen(
  index: number,
  videoUrl: string,
  token: string
) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/screens/${index}/update/`,
      {
        video_url: videoUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update screen";
    throw new Error(message);
  }
}
