import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Teams from "./Teams";
import { getMyTeamInvites } from "modules/gfwTeams";

const mapStateToProps = ({ gfwTeams }: RootState) => ({
  myInvites: gfwTeams.myInvites
});

const mapDispatchToProps = {
  getMyTeamInvites
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Teams);
