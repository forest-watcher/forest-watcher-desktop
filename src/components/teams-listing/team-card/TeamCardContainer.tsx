import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "store";
import TeamCard from "./TeamCard";
import { getTeamMembers } from "modules/gfwTeams";
import { IOwnProps } from "./TeamCard";

const mapStateToProps = ({ gfwTeams }: RootState, ownProps: IOwnProps) => {
  return {
    teamMembers: gfwTeams.members[ownProps.team.id] || [],
    teamAreas: gfwTeams.areas[ownProps.team.id] || []
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>, ownProps: IOwnProps) => ({
  getTeamMembers: () => dispatch(getTeamMembers(ownProps.team.id))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamCard);
