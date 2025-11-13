import axios from "axios";
import { API_BASE_URL } from "./api";

export const getScreenVideo = async (index: number): Promise<Blob> => {
  const response = await axios.get(`${API_BASE_URL}/screen/${index}/video`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getScreenVideoUrl = (index: number): string => {
  return `${API_BASE_URL}/screen/${index}/video`;
};
