import { connect } from 'react-redux';

import Areas from './Areas';

const mapStateToProps = ({ areas }) => ({
  areasList: areas.ids,
  loading: areas.loading
});

export default connect(mapStateToProps)(Areas);
