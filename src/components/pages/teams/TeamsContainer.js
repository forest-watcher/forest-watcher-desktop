import { connect } from 'react-redux';
import Teams from './Teams';
import { getTeams, createTeam, updateTeam, setEditing } from '../../../modules/teams';

const isManager = (team, userId) => {
  return team.attributes.managers.includes(userId);
}

const isUser = (team, userId) => {
  return team.attributes.users.includes(userId);
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
      userId: user.data.id,
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
    createTeam: (team) => {
       dispatch(createTeam(team));
    },
    updateTeam: (team) => {
       dispatch(updateTeam(team));
    },
    setEditing: (value) => {
       dispatch(setEditing(value));
    }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
