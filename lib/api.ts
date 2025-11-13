export const API_BASE_URL = "https://screener-api-sil.vercel.app/api";

import axios from "axios";

export interface ApiStatusResponse {
  message?: string;
  [key: string]: any;
}

export const getApiStatus = async (): Promise<ApiStatusResponse> => {
  const response = await axios.get<ApiStatusResponse>(`${API_BASE_URL}/`);
  return response.data;
};
