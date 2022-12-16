import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Teams from "./Teams";
import { getUserTeams, getMyTeamInvites } from "modules/gfwTeams";

const mapStateToProps = ({ gfwTeams }: RootState) => ({
  teams: gfwTeams.data,
  myInvites: gfwTeams.myInvites,
  numOfActiveFetches: gfwTeams.numOfActiveFetches,
  isLoading: gfwTeams.numOfActiveFetches > 0
});

const mapDispatchToProps = {
  getUserTeams,
  getMyTeamInvites
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Teams);
