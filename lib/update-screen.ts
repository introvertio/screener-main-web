import axios from "axios";
import { API_BASE_URL } from "./api";

export async function updateScreen(
  index: number,
  videoFile: File,
  token: string
) {
  const formData = new FormData();
  formData.append("video_file", videoFile);

  try {
    const response = await axios.put(
      `${API_BASE_URL}/screens/${index}/update/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' is automatically set to multipart/form-data by axios when using FormData
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
