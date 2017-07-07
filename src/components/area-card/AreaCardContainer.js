import { connect } from 'react-redux';
import AreaCard from './AreaCard';

const mapStateToProps = ({ areas }, { id }) => {
  const area = areas.data[id] && areas.data[id].attributes;
  return { area: { ...area, id } };
};

export default connect(mapStateToProps, null)(AreaCard);