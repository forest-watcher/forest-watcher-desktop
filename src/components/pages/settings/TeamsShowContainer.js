import { connect } from 'react-redux';
import TeamsShow from './TeamsShow';
import { filterEmpty } from '../../../helpers/utils';


const mapStateToProps = ({ teams, areas }) => {
  let team = teams.data;
  let areasIds = (team && team.attributes.areas) || [];
  areasIds = filterEmpty(areasIds);

  const areasOfInterest = areasIds.map((areaId) => areas.data[areaId]);
    return { 
      team,
      areas: areasOfInterest
    };
  };

 function mapDispatchToProps(dispatch) {
   return {}
 }

export default connect(mapStateToProps, mapDispatchToProps)(TeamsShow);
