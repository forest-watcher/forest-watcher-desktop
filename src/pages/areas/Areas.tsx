import { FC, useMemo, useState, Fragment, useCallback } from "react";
import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import EmptyState from "components/ui/EmptyState/EmptyState";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import { TPropsFromRedux } from "./AreasContainer";
import { TAreasResponse } from "services/area";
import AreaCard from "components/area-card/AreaCard";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import AreaIcon from "assets/images/icons/EmptyAreas.svg";
import { getNumberOfTeamsInArea } from "helpers/areas";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { UnpackNestedValue } from "react-hook-form";
import { AREA_EXPORT_FILE_TYPES } from "constants/export";
import { exportService } from "services/exports";
import { toastr } from "react-redux-toastr";

interface IProps extends TPropsFromRedux {}

const Areas: FC<IProps> = props => {
  const { areasList, loading, loadingTeamAreas, areasInUsersTeams } = props;
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);
  const [selectedArea, setSelectedArea] = useState<TAreasResponse | null>(null);
  const hasTeamAreas = useMemo(() => {
    const teamWithAreasIndex = areasInUsersTeams.findIndex(
      teamArea => teamArea.areas.length > 0 && teamArea.team !== null
    );

    return teamWithAreasIndex > -1;
  }, [areasInUsersTeams]);

  const intl = useIntl();
  const { url } = useRouteMatch();
  const history = useHistory();

  const handleAreaDeselect = useCallback(() => {
    setSelectedArea(null);
  }, []);

  const handleAreaSelect = useCallback(
    (areaId: string) => {
      setSelectedArea(areasList[areaId]);
    },
    [areasList]
  );

  const handleExport = useCallback(
    async (values: UnpackNestedValue<TExportForm>) => {
      // Do request
      try {
        const { data } = await exportService.exportAllAreas(values.fileType);
        return data;
      } catch (err) {
        // Do toast
        toastr.error(intl.formatMessage({ id: "export.error" }), "");
      }
    },
    [intl]
  );

  return (
    <div className="c-areas">
      <Hero
        title="areas.name"
        actions={
          <Link className="c-button c-button--primary" to={`${url}/export`}>
            <FormattedMessage id="areas.exportAreas" />
          </Link>
        }
      />
      {loading ? (
        <div className="c-map c-map--within-hero">
          <Loader isLoading />
        </div>
      ) : (
        <UserAreasMap
          className="c-map--within-hero"
          selectedAreaId={selectedArea?.id}
          onAreaSelect={handleAreaSelect}
          onAreaDeselect={handleAreaDeselect}
        >
          {selectedArea && (
            <AreaDetailCard
              area={selectedArea}
              numberOfTeams={getNumberOfTeamsInArea(selectedArea.id, areasInUsersTeams)}
            />
          )}
        </UserAreasMap>
      )}

      <div className="l-content l-content--neutral-400">
        {(!areaMap || areaMap.length === 0) && !loading ? (
          <div className="row column">
            <EmptyState
              iconUrl={AreaIcon}
              title={intl.formatMessage({ id: "areas.empty.title" })}
              text={intl.formatMessage({ id: "areas.empty.text" })}
              ctaText={intl.formatMessage({ id: "areas.createArea" })}
              ctaTo="/areas/create"
            />
          </div>
        ) : (
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
              {[...areaMap]
                .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name.toString()))
                .map((area: TAreasResponse) => (
                  <AreaCard area={area} key={area.id} className="c-areas__item" />
                ))}
            </div>
          </Article>
        )}
      </div>
      {hasTeamAreas && (
        <div className="l-content">
          {areasInUsersTeams && areasInUsersTeams.length > 0 && !loadingTeamAreas && (
            <Article title="areas.teamSubtitle">
              {areasInUsersTeams.map(
                areasInTeam =>
                  areasInTeam.team &&
                  areasInTeam.areas.length > 0 && (
                    <Fragment key={areasInTeam.team.id}>
                      <h3 className="u-text-600 u-text-neutral-700">{areasInTeam.team.attributes?.name}</h3>

                      <div className="c-areas__area-listing">
                        {[...areasInTeam.areas]
                          .sort((a, b) => a.data.attributes.name.localeCompare(b.data.attributes.name.toString()))
                          .map(area => (
                            <AreaCard area={area.data} key={area.data.id} className="c-areas__item" />
                          ))}
                      </div>
                    </Fragment>
                  )
              )}
            </Article>
          )}
          <Loader isLoading={loadingTeamAreas} />
        </div>
      )}
      <Switch>
        <Route path={`/areas/export`}>
          <ExportModal
            onSave={handleExport}
            onClose={() => history.push("/areas")}
            isOpen
            fileTypes={AREA_EXPORT_FILE_TYPES}
            fields={[]}
          />
        </Route>
      </Switch>
    </div>
  );
};
export default Areas;
