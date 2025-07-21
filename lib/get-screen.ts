import axios from "axios";
import { API_BASE_URL } from "./api";
import { Screen } from "./get-screens";

export const getScreen = async (
  token: string,
  index: number
): Promise<Screen> => {
  const response = await axios.get<Screen>(
    `${API_BASE_URL}/screens/${index}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
