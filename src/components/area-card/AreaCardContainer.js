import { connect } from 'react-redux';
import AreaCard from './AreaCard';

const mapStateToProps = ({ areas, templates, user }, { id }) => {
  const area = areas.data[id] && areas.data[id].attributes;
  return { 
    area: { ...area, id },
    templates,
    user: user.data
  };
};

export default connect(mapStateToProps, null)(AreaCard);