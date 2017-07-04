import { connect } from 'react-redux';
import Teams from './Teams';
import { getTeam, setEditing } from '../../../modules/teams';
import { includes } from '../../../helpers/utils';

const isManager = (team, userId) => {
  return includes(team.attributes.managers, userId);
}

const mapStateToProps = ({ user, teams, areas }) => {
  const userId = user.data.id;
  const diff = (original, toSubstract) => {
    return original.filter((i) => toSubstract.indexOf(i) < 0);
  };

  function removeManagersfromUsers(team) {
    // Managers are always also users. We remove them to handle them only as managers in the app
    if (team) {
      team.attributes.users = diff(team.attributes.users, team.attributes.managers)
    }
    return team;
  }

  let team = removeManagersfromUsers(teams.data);
    return { 
      team,
      isManager: team && isManager(team, userId),
      editing: teams.editing,
      userId
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
