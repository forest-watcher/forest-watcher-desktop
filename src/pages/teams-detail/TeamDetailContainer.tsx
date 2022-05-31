import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import TeamDetail, { IOwnProps } from "./TeamDetail";
import { getTeamMembers, getUserTeams } from "../../modules/gfwTeams";

const mapStateToProps = ({ gfwTeams, user }: RootState, ownProps: IOwnProps) => {
  let userMember = gfwTeams.members[ownProps.match.params.teamId]?.find(
    member => member.attributes.userId === user.data.id
  );

  return {
    team: gfwTeams.data.find(team => team.id === ownProps.match.params.teamId),
    teamMembers: gfwTeams.members[ownProps.match.params.teamId] || [],
    userIsManager: userMember?.attributes.role === "administrator" || userMember?.attributes.role === "manager",
    numOfActiveFetches: gfwTeams.numOfActiveFetches
  };
};

const mapDispatchToProps = {
  getUserTeams,
  getTeamMembers
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamDetail);
