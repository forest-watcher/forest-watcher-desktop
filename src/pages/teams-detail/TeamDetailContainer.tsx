import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import TeamDetail, { IOwnProps } from "./TeamDetail";

const mapStateToProps = ({ gfwTeams }: RootState, ownProps: IOwnProps) => ({
  team: gfwTeams.data.filter(team => team.id === ownProps.match.params.teamId)
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamDetail);
