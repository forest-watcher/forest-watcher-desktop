import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Invitation from "./Invitation";
import { getMyTeamInvites } from "modules/gfwTeams";

const mapStateToProps = ({ gfwTeams }: RootState) => ({
  invitations: gfwTeams.myInvites,
  invitationsFetched: gfwTeams.myInvitesFetched
});

const mapDispatchToProps = { getMyTeamInvites };

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Invitation);
