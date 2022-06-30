import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import Reports from "./Reports";
import { getMyTeamInvites } from "modules/gfwTeams";

const mapStateToProps = ({ reports }: RootState) => ({
  reports: reports.answers
});

const mapDispatchToProps = { getMyTeamInvites };

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Reports);
