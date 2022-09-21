import { useAppDispatch, useAppSelector } from "./useRedux";
import { getUser } from "modules/user";

const useGetUserId = () => {
  const dispatch = useAppDispatch();
  const { data: { id: userId } = { id: undefined }, fetching } = useAppSelector(({ user }) => user);

  if (!userId && !fetching) {
    dispatch(getUser());
  }

  return userId;
};

export default useGetUserId;
