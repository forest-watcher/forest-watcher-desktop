import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import TeamDetail, { IOwnProps } from "./TeamDetail";
import { getTeamAreas } from "modules/gfwTeams";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = ({ gfwTeams, user, areas }: RootState, ownProps: IOwnProps) => {
  let userMember = gfwTeams.members[ownProps.match.params.teamId]?.find(
    member => member.attributes.userId === user.data.id
  );

  return {
    userIsAdmin: userMember?.attributes.role === "administrator",
    userIsManager: userMember?.attributes.role === "administrator" || userMember?.attributes.role === "manager"
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>, ownProps: IOwnProps) => ({
  getTeamAreas: (teamId: string) => dispatch(getTeamAreas(teamId))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamDetail);
