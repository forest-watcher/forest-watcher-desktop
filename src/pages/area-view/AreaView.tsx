import Hero from "components/layouts/Hero/Hero";
import Map from "components/ui/Map/Map";
import { FC, useState, useEffect } from "react";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { FormattedMessage } from "react-intl";
import { TPropsFromRedux } from "./AreaViewContainer";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";
import Polygon from "components/ui/Map/components/layers/Polygon";
import Button from "components/ui/Button/Button";
import { Link } from "react-router-dom";

interface IProps extends TPropsFromRedux {}

const AreasView: FC<IProps> = ({ geojson, area, loading }) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  useEffect(() => {
    if (geojson) {
      goToGeojson(mapRef, geojson);
    }
  }, [geojson, mapRef]);

  return (
    <div className="c-area-manage">
      <Hero
        title="areas.manageAreaName"
        titleValues={{ name: area?.attributes.name }}
        backLink={{ name: "areas.back", to: "/areas" }}
        actions={
          area && (
            <>
              <Link to={`/areas/${area.id}/edit`} className="c-button c-button--primary">
                <FormattedMessage id="common.edit" />
              </Link>
              <Button variant="secondary-light-text">
                <FormattedMessage id="common.export" />
              </Button>
              <a
                href={`${process.env.REACT_APP_FLAGSHIP_URL}/my-gfw/`}
                target="_blank"
                rel="noopenner noreferrer"
                className="c-button c-button--secondary-light-text"
              >
                <FormattedMessage id="areas.viewInGfw" />
              </a>
            </>
          )
        }
      />

      {loading ? (
        <div className="c-map c-map--within-hero">
          <Loader isLoading />
        </div>
      ) : (
        <Map className="c-map--within-hero" onMapLoad={handleMapLoad}>
          {area && <Polygon id={area.id} label={area.attributes.name} data={geojson} />}
        </Map>
      )}
    </div>
  );
};
export default AreasView;
