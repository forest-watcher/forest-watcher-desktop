import { connect } from 'react-redux';
import TeamsForm from './TeamsForm';
import { createTeam, updateTeam, setEditing, addEmail } from '../../../modules/teams';

const mapStateToProps = ({ areas, user, teams }) => {
  const areaValues = Object.keys(areas.areas).map((key) => ({
    value: areas.areas[key].id,
    label: areas.areas[key].attributes.name
  }));
    return { 
      userId: user.data.id,
      areaValues,
      editing: teams.editing
    };
  };

 function mapDispatchToProps(dispatch) {
   return {
    createTeam: (team) => {
       dispatch(createTeam(team));
    },
    updateTeam: (team, id) => {
       dispatch(updateTeam(team, id));
    },
    setEditing: (value) => {
       dispatch(setEditing(value));
    },
    addEmail: (email) => {
       dispatch(addEmail(email));
    }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(TeamsForm);