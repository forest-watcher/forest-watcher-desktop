import { connect } from 'react-redux'; 
import { withRouter } from 'react-router'
import Filters from './Filters';
import qs from 'query-string';


const mapStateToProps = ({ reports, templates }, { match, location }) => {    
  const templateIndex = match.params.templateIndex;
  const searchParams = qs.parse(location.search);
  return {
    templates,
    searchParams,
    templateIndex
  };
};

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filters));
