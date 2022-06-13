import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";

import Areas from "./Areas";

const mapStateToProps = ({ areas, user, app }: RootState) => ({
  areasList: areas.data,
  loading: areas.loading,
  userChecked: app.userChecked
});

const connector = connect(mapStateToProps);

export type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Areas);
