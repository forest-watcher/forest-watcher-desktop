import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import Teams from "./Teams";
import { getUserTeams, getMyTeamInvites } from "modules/gfwTeams";
import { getUser } from "modules/user";

const mapStateToProps = ({ gfwTeams, user }: RootState) => ({
  teams: gfwTeams.data,
  myInvites: gfwTeams.myInvites,
  userId: user.data?.id
});

const mapDispatchToProps = {
  getUserTeams,
  getMyTeamInvites,
  getUser
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Teams);
