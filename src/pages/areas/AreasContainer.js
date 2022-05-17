import { connect } from "react-redux";

import Areas from "./Areas";

const mapStateToProps = ({ areas, user, app }) => ({
  areasList: areas.data,
  loading: areas.loading,
  userChecked: app.userChecked
});

export default connect(mapStateToProps)(Areas);
