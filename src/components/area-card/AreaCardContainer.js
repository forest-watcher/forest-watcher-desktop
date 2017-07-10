import { connect } from 'react-redux';
import AreaCard from './AreaCard';

const mapStateToProps = ({ areas, templates }, { id }) => {
  const area = areas.data[id] && areas.data[id].attributes;
  return { 
    area: { ...area, id },
    templates
  };
};

export default connect(mapStateToProps, null)(AreaCard);