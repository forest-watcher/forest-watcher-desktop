import { connect } from "react-redux";
import TeamsForm from "./TeamsForm";
import { createTeam, updateTeam, setEditing, sendNotifications } from "../../modules/teams";

const mapStateToProps = ({ areas, user, teams }) => {
  const areaValues = Object.keys(areas.data).map(key => ({
    value: areas.data[key].id,
    label: areas.data[key].attributes.name
  }));
  return {
    userId: user.data.id,
    areaValues,
    editing: teams.editing,
    loading: teams.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    createTeam: team => {
      dispatch(createTeam(team));
    },
    updateTeam: (team, id) => {
      dispatch(updateTeam(team, id));
    },
    setEditing: value => {
      dispatch(setEditing(value));
    },
    sendNotifications: () => {
      dispatch(sendNotifications());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsForm);
