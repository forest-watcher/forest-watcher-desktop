import { connect } from 'react-redux';
import AreaCard from './AreaCard';

const mapStateToProps = ({ areas }, { id }) => {
  const area = areas.area[id] && areas.area[id].attributes;
  return { area: { ...area, id } };
};

export default connect(mapStateToProps, null)(AreaCard);
