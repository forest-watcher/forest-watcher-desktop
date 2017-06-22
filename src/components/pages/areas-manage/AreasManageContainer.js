import { connect } from 'react-redux';
import { saveAreaWithGeostore } from '../../../modules/areas';

import AreasManage from './AreasManage';

const readGeojson = (state, match) => {
  const areaId = match.params.areaId;
  const area = state.areas.areas[areaId] || null;
  const geostoreId = area ? area.attributes.geostore : null;
  const geostore = state.geostores.geostores[geostoreId] || null;
  const geojson = geostore ? geostore.attributes.geojson : null;
  return geojson;
}

const readArea = (state, match) => {
  const areaId = match.params.areaId;
  const area = state.areas.areas[areaId] || null;
  return area;
}

const mapStateToProps = (state, { match }) => ({
  loading: state.areas.loading,
  geojson: readGeojson(state, match),
  area: readArea(state, match)
});

function mapDispatchToProps(dispatch) {
  return {
    saveAreaWithGeostore: (area, node) => {
      dispatch(saveAreaWithGeostore(area, node));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreasManage);
