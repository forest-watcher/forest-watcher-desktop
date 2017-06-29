import { connect } from 'react-redux';
import Teams from './Teams';
import { getTeams, createTeam, updateTeam, setEditing } from '../../../modules/teams';
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

const mapStateToProps = ({ areas, user, teams }) => {
  const userId = user.data.id;
  let teamId = null;
  if(teams.ids.length > 0){
    teamId = Object.keys(teams.data).find((key) => {
        return belongsToTeam(teams.data[key], userId);
      }) || null;
  }
  const areaValues = Object.keys(areas.areas).map((key) => ({
    value: areas.areas[key].id,
    label: areas.areas[key].attributes.name
  }));
  const team = teams.data[teamId]
    return { 
      userId: user.data.id,
      team,
      areaValues,
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
    updateTeam: (team, id) => {
       dispatch(updateTeam(team, id));
    },
    setEditing: (value) => {
       dispatch(setEditing(value));
    }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
