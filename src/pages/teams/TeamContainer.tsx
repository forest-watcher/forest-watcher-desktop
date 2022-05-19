import { connect, ConnectedProps } from "react-redux";
import { RootState } from "index";
import Teams from "./Teams";
import { getUserTeams } from "modules/gfwTeams";
import { getUser } from "../../modules/user";

const mapStateToProps = ({ gfwTeams, user }: RootState) => ({
  teams: gfwTeams?.data,
  userId: user.data?.id
});

const mapDispatchToProps = {
  getUserTeams,
  getUser
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Teams);
