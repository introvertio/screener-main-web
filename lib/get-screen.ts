import axios from "axios";
import { API_BASE_URL } from "./api";
import { Screen } from "./get-screens";

export interface SingleScreenResponse extends Screen {
  owner: string; // Required for individual screen responses
}

export const getScreen = async (
  token: string,
  index: number
): Promise<SingleScreenResponse> => {
  const response = await axios.get<SingleScreenResponse>(
    `${API_BASE_URL}/screen/${index}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
