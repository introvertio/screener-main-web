import axios from "axios";
import { API_BASE_URL } from "./api";

export interface ValidateResponse {
  message: string;
}

export const validateAuth = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get<ValidateResponse>(
      `${API_BASE_URL}/validate-token/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
