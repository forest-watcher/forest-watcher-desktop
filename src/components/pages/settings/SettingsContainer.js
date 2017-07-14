import { connect } from 'react-redux';
import Settings from './Settings';
import { getTeam, setEditing } from '../../../modules/teams';
import { getLayers, getGFWLayers } from '../../../modules/layers';
import { includes, filterEmpty } from '../../../helpers/utils';


const mapStateToProps = ({ user, teams, areas, layers }) => {
  const userId = user.data.id;

  function isUserManager(team, userId) {
    return includes(team.attributes.managers, userId);
  }

  let team = teams.data;
  const isManager = team && isUserManager(team, userId);
  let areasIds = (team && team.attributes.areas) || [];
  areasIds = filterEmpty(areasIds);

  const areasOfInterest = areasIds.map((areaId) => areas.data[areaId]);
    return { 
      team,
      isManager,
      editing: teams.editing,
      loading: teams.loading,
      saving: teams.saving || layers.loading,
      userId,
      areas: areasOfInterest
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getTeam: (userId) => {
       dispatch(getTeam(userId));
     },
     setEditing: (value) => {
       dispatch(setEditing(value));
     },
     getLayers: () => {
       dispatch(getLayers());
     },
     getGFWLayers: () => {
       dispatch(getGFWLayers());
     }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
