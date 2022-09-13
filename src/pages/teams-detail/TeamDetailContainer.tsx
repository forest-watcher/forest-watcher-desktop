import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import TeamDetail, { IOwnProps } from "./TeamDetail";
import { getTeamMembers, getUserTeams } from "../../modules/gfwTeams";

const mapStateToProps = ({ gfwTeams, user, areas }: RootState, ownProps: IOwnProps) => {
  let userMember = gfwTeams.members[ownProps.match.params.teamId]?.find(
    member => member.attributes.userId === user.data.id
  );
  const areaIds: string[] =
    gfwTeams.data.find(data => data.id === ownProps.match.params.teamId)?.attributes.areas || [];

  return {
    team: gfwTeams.data.find(team => team.id === ownProps.match.params.teamId),
    teamMembers: gfwTeams.members[ownProps.match.params.teamId] || [],
    teamAreas: Object.entries(areas.data)
      .filter(([key, _]) => areaIds.includes(key))
      .map(([_, value]) => value),
    userIsAdmin: userMember?.attributes.role === "administrator",
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
