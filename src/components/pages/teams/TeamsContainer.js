import { connect } from 'react-redux';
import Teams from './Teams';
import { getTeams, setEditing } from '../../../modules/teams';
import { includes } from '../../../helpers/utils';

const isManager = (team, userId) => {
  return includes(team.attributes.managers,userId);
}

const isUser = (team, userId) => {
  return includes(team.attributes.users, userId);
}

const belongsToTeam = (team, userId) => {
  return (isManager(team, userId) || isUser(team, userId));
}

const mapStateToProps = ({ user, teams }) => {
  const userId = user.data.id;
  let teamId = null;
  if(teams.ids.length > 0){
    teamId = Object.keys(teams.data).find((key) => {
        return belongsToTeam(teams.data[key], userId);
      }) || null;
  }

  const team = teams.data[teamId]
    return { 
      team,
      isManager: team && isManager(team, userId),
      editing: teams.editing
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
     getTeams: () => {
       dispatch(getTeams());
     },
     setEditing: (value) => {
       dispatch(setEditing(value));
     }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
