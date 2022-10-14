import { useSelector } from "react-redux";
import { RootState } from "store";

export const useAccessToken = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const httpAuthHeader = { Authorization: `Bearer ${token}` };
  return { token, httpAuthHeader };
};
