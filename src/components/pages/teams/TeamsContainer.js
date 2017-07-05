import { connect } from 'react-redux';
import Teams from './Teams';
import { getTeam, setEditing } from '../../../modules/teams';
import { includes, diff } from '../../../helpers/utils';


const mapStateToProps = ({ user, teams, areas }) => {
  const userId = user.data.id;

  function isUserManager(team, userId) {
    return includes(team.attributes.managers, userId);
  }

  function removeManagersfromUsers(team) {
    // Managers are always also users. We remove them to handle them only as managers in the app
    if (team) {
      team.attributes.users = diff(team.attributes.users, team.attributes.managers)
    }
    return team;
  }

  let team = teams.data;
  const isManager = team && isUserManager(team, userId);
  team = removeManagersfromUsers(teams.data);
  const areasIds = (team && team.attributes.areas) || [];
  const areasOfInterest = areasIds.map((areaId) => areas.areas[areaId]);
    return { 
      team,
      isManager,
      editing: teams.editing,
      userId,
      areasOfInterest
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getTeam: (userId) => {
       dispatch(getTeam(userId));
     },
     setEditing: (value) => {
       dispatch(setEditing(value));
     }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
