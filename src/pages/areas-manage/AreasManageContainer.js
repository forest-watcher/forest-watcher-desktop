import { connect } from "react-redux";
import { saveAreaWithGeostore, setSaving, setLoading } from "../../modules/areas";
import { getGeoFromShape } from "../../modules/geostores";

import AreasManage from "./AreasManage";

const readGeojson = (state, match) => {
  const areaId = match.params.areaId;
  const area = state.areas.data[areaId] || null;
  const geostoreId = area ? area.attributes.geostore : null;
  const geostore = state.geostores.data[geostoreId] || null;
  const geojson = geostore ? geostore.attributes.geojson.features[0] : null;
  if (geojson) geojson.properties = {};
  return geojson;
};

const readArea = (state, match) => {
  const areaId = match.params.areaId;
  const area = state.areas.data[areaId] || null;
  return area;
};

const mapStateToProps = (state, { match }) => ({
  mode: match.params.areaId ? "manage" : "create",
  loading: state.areas.loading,
  editing: state.areas.editing,
  saving: state.areas.saving,
  geojson: readGeojson(state, match),
  area: readArea(state, match)
});

function mapDispatchToProps(dispatch) {
  return {
    getGeoFromShape: async area => {
      return await dispatch(getGeoFromShape(area));
    },
    saveAreaWithGeostore: (area, node, method) => {
      dispatch(saveAreaWithGeostore(area, node, method));
    },
    setSaving: bool => {
      dispatch(setSaving(bool));
    },
    setLoading: bool => {
      dispatch(setLoading(bool));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreasManage);
