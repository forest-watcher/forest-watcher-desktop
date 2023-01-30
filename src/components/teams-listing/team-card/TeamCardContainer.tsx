import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import TeamCard from "./TeamCard";
import { IOwnProps } from "./TeamCard";

const mapStateToProps = ({ gfwTeams }: RootState, ownProps: IOwnProps) => {
  return {
    teamAreas: ownProps.team.id ? gfwTeams.areas[ownProps.team.id] : []
  };
};

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TeamCard);
