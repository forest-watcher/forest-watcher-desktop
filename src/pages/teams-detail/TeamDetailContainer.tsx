import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import TeamDetail, { IOwnProps } from "./TeamDetail";
import { getTeamMembers, getUserTeams, getTeamAreas } from "modules/gfwTeams";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = ({ gfwTeams, user, areas }: RootState, ownProps: IOwnProps) => {
  let userMember = gfwTeams.members[ownProps.match.params.teamId]?.find(
    member => member.attributes.userId === user.data.id
  );

  return {
    team: gfwTeams.data.find(team => team.id === ownProps.match.params.teamId),
    teamMembers: gfwTeams.members[ownProps.match.params.teamId] || [],
    teamAreas:
      areas.areasInUsersTeams.find(areasAndTeam => areasAndTeam.team?.id === ownProps.match.params.teamId)?.areas || [],
    userIsAdmin: userMember?.attributes.role === "administrator",
    userIsManager: userMember?.attributes.role === "administrator" || userMember?.attributes.role === "manager",
    numOfActiveFetches: gfwTeams.numOfActiveFetches,
    isLoading: gfwTeams.numOfActiveFetches > 0 || areas.loadingAreasInUsers
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>, ownProps: IOwnProps) => ({
  getUserTeams,
  getTeamMembers,
  getTeamAreas: (teamId: string) => dispatch(getTeamAreas(teamId))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamDetail);
