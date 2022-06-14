import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import Map from "components/ui/Map/Map";
import { FC, useMemo, useEffect, useState } from "react";
import Polygon from "components/ui/Map/components/layers/Polygon";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import * as turf from "@turf/turf";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import EmptyState from "components/ui/EmptyState/EmptyState";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import Card from "components/ui/Card/Card";
import EditIcon from "assets/images/icons/Edit.svg";
import { TPropsFromRedux } from "./AreasContainer";
import { goToGeojson } from "helpers/map";

interface IProps extends TPropsFromRedux {}

const Areas: FC<IProps> = props => {
  const { areasList, loading } = props;
  const areaMap = useMemo(() => Object.values(areasList), [areasList]);
  const intl = useIntl();

  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const features = useMemo(() => {
    if (areaMap.length > 0) {
      const mapped = areaMap.map((area: any) => area.attributes.geostore.geojson.features).flat();
      return turf.featureCollection(mapped);
    }
    return null;
  }, [areaMap]);

  useEffect(() => {
    if (features) {
      goToGeojson(mapRef, features);
    }
  }, [features, mapRef]);

  const handleMapLoad = (evt: MapboxEvent) => {
    setMapRef(evt.target);
  };

  return (
    <div className="c-areas">
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
              {areaMap.map((area: any) => (
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

      <div className="l-content l-content--neutral-400">
        <Article
          title="areas.subtitle"
          actions={
            <ReactGA.OutboundLink eventLabel="Add new area" to="/areas/create" className="c-button c-button--primary">
              <img src={PlusIcon} alt="" role="presentation" className="c-button__inline-icon" />
              <FormattedMessage id="areas.addArea" />
            </ReactGA.OutboundLink>
          }
        >
          <div className="c-areas__area-listing">
            {areaMap.map((area: any) => (
              <Card size="large" key={area.id} className="c-areas__item">
                <Card.Image alt="" src={area.attributes.image} loading="lazy" />
                <div className="c-card__content-flex">
                  <div>
                    <Card.Title className="u-margin-top-none">{area.attributes.name}</Card.Title>
                  </div>
                  <Card.Cta to={`/areas/${area.id}`} iconSrc={EditIcon}>
                    <FormattedMessage id="common.manage" />
                  </Card.Cta>
                </div>
              </Card>
            ))}
          </div>
        </Article>
      </div>
      <div className="l-content">
        <Article title="areas.teamSubtitle"></Article>
      </div>
    </div>
  );
};
export default Areas;
