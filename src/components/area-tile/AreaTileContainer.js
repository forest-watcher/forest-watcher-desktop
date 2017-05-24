import { connect } from 'react-redux';
import AreaTile from './AreaTile';

const mapStateToProps = ({ areas }, { id }) => {
  const area = areas.area[id] && areas.area[id].attributes;
  return { area: { ...area, id } };
};

export default connect(mapStateToProps, null)(AreaTile);
