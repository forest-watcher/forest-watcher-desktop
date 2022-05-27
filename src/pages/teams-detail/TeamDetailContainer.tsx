import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import TeamDetail, { IOwnProps } from "./TeamDetail";

const mapStateToProps = ({ gfwTeams, user }: RootState, ownProps: IOwnProps) => ({
  team: gfwTeams.data.find(team => team.id === ownProps.match.params.teamId),
  teamMembers: gfwTeams.members[ownProps.match.params.teamId]
  // ToDo: userIsManager flag
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamDetail);
