import Hero from "components/layouts/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import Map from "components/ui/Map/Map";
import { FC, useMemo, useEffect, useState } from "react";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { LngLatBoundsLike, MapboxEvent, Map as MapInstance } from "mapbox-gl";
import * as turf from "@turf/turf";
import Icon from "components/ui/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import EmptyState from "components/ui/EmptyState/EmptyState";

interface IProps {
  areasList: Array<any>;
  loading: boolean;
}

const Areas: FC<IProps> = props => {
  const { areasList, loading } = props;
  const areaMap = useMemo(() => Object.values(areasList), [areasList]);
  const intl = useIntl();

  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const bbox = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map(area => area.attributes.geostore.geojson.features).flat();
      const features = turf.featureCollection(mapped);
      return turf.bbox(features);
    }
    return [];
  }, [areaMap]);

  useEffect(() => {
    if (mapRef && bbox.length > 0) {
      mapRef.fitBounds(bbox as LngLatBoundsLike);
    }
  }, [bbox, mapRef]);

  const handleMapLoad = (evt: MapboxEvent) => {
    setMapRef(evt.target);
  };

  return (
    <div>
      <Hero title="areas.name" />
      {(!areaMap || areaMap.length === 0) && !loading ? (
        <div className="row column">
          <EmptyState
            title={intl.formatMessage({ id: "areas.empty.title" })}
            text={intl.formatMessage({ id: "areas.empty.text" })}
            ctaText={intl.formatMessage({ id: "areas.addArea" })}
            ctaTo="/areas/create"
            hasMargins
          />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="c-map c-map--within-hero">
              <Loader isLoading />
            </div>
          ) : (
            <Map className="c-map--within-hero" onMapLoad={handleMapLoad}>
              {areaMap.map(area => (
                <Polygon
                  key={area.id}
                  id={area.id}
                  label={area.attributes.name}
                  data={area.attributes.geostore.geojson}
                />
              ))}
            </Map>
          )}
        </>
      )}
      <div className="l-content">
        <Article title="areas.subtitle">
          <ReactGA.OutboundLink eventLabel="Add new area" to="/areas/create">
            <button className="c-add-card">
              <Icon name="icon-plus" className="-medium -green" />
              <span className="text -x-small-title -green">
                <FormattedMessage id="areas.addArea" />
              </span>
            </button>
          </ReactGA.OutboundLink>
        </Article>
      </div>
    </div>
  );
};
export default Areas;
