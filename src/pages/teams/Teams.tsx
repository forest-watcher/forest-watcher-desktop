import { FC, useEffect } from "react";
import { TPropsFromRedux } from "./TeamContainer";

interface IProps extends TPropsFromRedux {}

const Teams: FC<IProps> = props => {
  const { teams, getUserTeams, userId, getUser } = props;

  if (!userId) {
    getUser();
  }

  useEffect(() => {
    if (userId) getUserTeams(userId);
  }, [getUserTeams, userId]);

  return (
    <div>
      <code>{JSON.stringify(teams)}</code>
    </div>
  );
};

export default Teams;
