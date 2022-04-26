import { connect } from "react-redux";
import Settings from "./Settings";
import { getTeam, setEditing } from "../../modules/teams";
import { getLayers, getGFWLayers } from "../../modules/layers";
import { includes, filterEmpty } from "../../helpers/utils";

const mapStateToProps = ({ user, teams, areas, layers }) => {
  const userId = user.data.id;
  function isUserManager(team, userId) {
    return (
      includes(team.attributes.managers, userId) ||
      includes(
        team.attributes.managers.map(m => m.id),
        userId
      )
    );
  }

  let team = teams.data;
  const isManager = team && isUserManager(team, userId) ? true : false;
  let areasIds = (team && team.attributes.areas) || [];
  areasIds = filterEmpty(areasIds);
  const selectedLayers = layers.selectedLayerIds.map(id => layers.selectedLayers[id]);
  const publicLayers = selectedLayers.filter(
    selectedLayer => selectedLayer.attributes && selectedLayer.attributes.isPublic
  );
  const teamLayers = selectedLayers.filter(
    selectedLayer =>
      selectedLayer.attributes && !selectedLayer.attributes.isPublic && selectedLayer.attributes.owner.type === "TEAM"
  );
  const userLayers = selectedLayers.filter(
    selectedLayer =>
      selectedLayer.attributes && !selectedLayer.attributes.isPublic && selectedLayer.attributes.owner.type === "USER"
  );

  const areasOfInterest = areasIds.map(areaId => areas.data[areaId]);
  return {
    team,
    isManager,
    editing: teams.editing,
    loading: teams.loading,
    saving: teams.saving || layers.loading,
    userId,
    areas: areasOfInterest,
    publicLayers,
    teamLayers,
    userLayers
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getTeam: userId => {
      dispatch(getTeam(userId));
    },
    setEditing: value => {
      dispatch(setEditing(value));
    },
    getLayers: () => {
      dispatch(getLayers());
    },
    getGFWLayers: () => {
      dispatch(getGFWLayers());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
