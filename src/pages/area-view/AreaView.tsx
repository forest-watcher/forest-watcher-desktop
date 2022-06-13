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
import { Link, Route, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import Article from "components/layouts/Article";
import DataTable from "components/ui/DataTable/DataTable";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import AddTemplateModal from "./actions/AddTemplate";

interface IProps extends TPropsFromRedux {}
export type TParams = {
  areaId: string;
};

const AreasView: FC<IProps & RouteComponentProps<TParams>> = ({ geojson, area, loading, match }) => {
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  let { path, url } = useRouteMatch();

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  useEffect(() => {
    if (geojson) {
      goToGeojson(mapRef, geojson);
    }
  }, [geojson, mapRef]);

  return (
    <>
      <div className="c-area-manage">
        <Hero
          title="areas.manageAreaName"
          titleValues={{ name: area?.attributes.name }}
          backLink={{ name: "areas.back", to: "/areas" }}
          actions={
            area && (
              <>
                <Link to={`${url}/edit`} className="c-button c-button--primary">
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
        <div className="l-content">
          <Article
            title="areas.details.templates"
            titleValues={{ num: 5 }}
            actions={
              <Link to={`${url}/add/template`} className="c-button c-button--primary">
                <img className="c-button__inline-icon" src={PlusIcon} alt="" role="presentation" />
                <FormattedMessage id="areas.details.templates.add.title" />
              </Link>
            }
          >
            <div className="u-responsive-table">
              {/* <DataTable<TTeamDetailDataTable>
              className="u-w-100"
              rows={manages.map(m => m.attributes)}
              columnOrder={userIsManager ? columnOrderWithStatus : columnOrder}
              rowActions={userIsManager ? [makeMonitor, removeMember] : undefined}
            /> */}
            </div>
          </Article>
        </div>
      </div>
      <Switch>
        <Route path={`${path}/add/template`}>
          <AddTemplateModal />
        </Route>
      </Switch>
    </>
  );
};
export default AreasView;
