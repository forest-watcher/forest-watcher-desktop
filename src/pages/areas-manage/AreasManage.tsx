import Hero from "components/layouts/Hero";
import Map from "components/ui/Map/Map";
import { FC, useState, useEffect } from "react";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import { FormattedMessage, useIntl } from "react-intl";
import { TPropsFromRedux } from "./AreasManageContainer";
import { goToGeojson } from "helpers/map";
import Loader from "components/ui/Loader";
import Polygon from "components/ui/Map/components/layers/Polygon";

interface IProps extends TPropsFromRedux {}

const AreasManage: FC<IProps> = ({ geojson, area, loading }) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);

  const intl = useIntl();

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
export default AreasManage;
