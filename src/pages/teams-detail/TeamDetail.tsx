import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TPropsFromRedux } from "./TeamDetailContainer";

type TParams = {
  teamId: string;
};

export interface IOwnProps extends RouteComponentProps<TParams> {}

type IProps = IOwnProps & TPropsFromRedux;

const TeamDetail: FC<IProps> = props => {
  const { team } = props;

  return <div>{JSON.stringify(team)}</div>;
};

export default TeamDetail;
