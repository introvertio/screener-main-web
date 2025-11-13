import axios from "axios";
import { API_BASE_URL } from "./api";

export interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};
