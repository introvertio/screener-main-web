import axios from "axios";
import { API_BASE_URL } from "./api";
import { SingleScreenResponse } from "./get-screen";

export async function updateScreen(
  index: number,
  videoUrl: string,
  token: string
): Promise<SingleScreenResponse> {
  try {
    const response = await axios.put<SingleScreenResponse>(
      `${API_BASE_URL}/screen/${index}/`,
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
