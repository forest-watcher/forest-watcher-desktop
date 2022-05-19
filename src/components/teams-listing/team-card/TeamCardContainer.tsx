import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import TeamCard from "./TeamCard";
import { getTeamMembers } from "modules/gfwTeams";
import { IOwnProps } from "./TeamCard";

const mapStateToProps = ({ gfwTeams }: RootState, ownProps: IOwnProps) => ({
  teamMembers: gfwTeams.members[ownProps.team.id]
});

const mapDispatchToProps = {
  getTeamMembers
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamCard);
