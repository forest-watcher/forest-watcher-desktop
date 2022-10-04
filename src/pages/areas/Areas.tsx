import { FC, useMemo, useState, Fragment, useCallback, useEffect } from "react";
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
import { getAreaTeams } from "helpers/areas";
import { Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { UnpackNestedValue } from "react-hook-form";
import { AREA_EXPORT_FILE_TYPES } from "constants/export";
import { exportService } from "services/exports";
import { toastr } from "react-redux-toastr";
import { MapboxEvent, Map as MapInstance } from "mapbox-gl";
import classNames from "classnames";
import { fireGAEvent } from "helpers/analytics";
import { AreaActions, AreaLabel } from "types/analytics";

interface IProps extends TPropsFromRedux {
  getTeamMembers: (teamId: string) => void;
}

const Areas: FC<IProps> = props => {
  const { areasList, loading, loadingTeamAreas, areasInUsersTeams, allAnswers, teamMembers, getTeamMembers } = props;
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);
  const [selectedArea, setSelectedArea] = useState<TAreasResponse | null>(null);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [currentBoundsStr, setCurrentBoundsStr] = useState("");
  const hasTeamAreas = useMemo(() => {
    const teamWithAreasIndex = areasInUsersTeams.findIndex(
      teamArea => teamArea.areas.length > 0 && teamArea.team !== null
    );

    return teamWithAreasIndex > -1;
  }, [areasInUsersTeams]);

  const answersBySelectedArea = useMemo(() => {
    return allAnswers?.filter(
      answer =>
        answer.attributes?.areaOfInterest === selectedArea?.id && Boolean(answer?.attributes?.clickedPosition?.length)
    );
  }, [allAnswers, selectedArea]);

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
        const { data } = await exportService.exportAllAreas(values.fileType, values.email);
        return data;
      } catch (err) {
        // Do toast
        toastr.error(intl.formatMessage({ id: "export.error" }), "");
      }
    },
    [intl]
  );

  const handleMapLoad = (e: MapboxEvent) => {
    setMapRef(e.target);
  };

  useEffect(() => {
    const onIdleHandler = () => {
      // Get current bounds.
      const bounds = mapRef?.getBounds();
      if (bounds) {
        setCurrentBoundsStr(JSON.stringify([bounds.getSouthWest(), bounds.getNorthEast()]));
      }
    };

    mapRef?.on("idle", onIdleHandler);

    return () => {
      mapRef?.off("idle", onIdleHandler);
    };
  }, [mapRef]);

  useEffect(() => {
    areasInUsersTeams.forEach(team => {
      team.team?.id && getTeamMembers(team.team?.id);
    });
  }, [areasInUsersTeams, getTeamMembers]);

  return (
    <div className="c-areas">
      <Hero
        title="areas.name"
        actions={
          <Link
            className={classNames(
              "c-button c-button--primary",
              areaMap.length === 0 && !hasTeamAreas && "c-button--disabled"
            )}
            to={`${url}/export`}
            onClick={() =>
              fireGAEvent({
                category: "Areas",
                action: AreaActions.Export
              })
            }
          >
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
          onMapLoad={handleMapLoad}
        >
          {selectedArea && (
            <AreaDetailCard
              area={selectedArea}
              teams={getAreaTeams(selectedArea.id, areasInUsersTeams)}
              numberOfReports={answersBySelectedArea?.length}
              onStartInvestigation={() =>
                fireGAEvent({
                  category: "Areas",
                  action: AreaActions.Investigation,
                  label: AreaLabel.StartedInvestigation
                })
              }
              onManageArea={() =>
                fireGAEvent({
                  category: "Areas",
                  action: AreaActions.Managed,
                  label: AreaLabel.StartedFromAreas
                })
              }
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
              ctaTo={`/areas/create?bounds=${currentBoundsStr}`}
            />
          </div>
        ) : (
          <Article
            title="areas.subtitle"
            actions={
              <ReactGA.OutboundLink
                eventLabel="Add new area"
                to={`/areas/create?bounds=${currentBoundsStr}`}
                className="c-button c-button--primary"
              >
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
      {loadingTeamAreas && (
        <div className="l-content">
          <Loader isLoading />
        </div>
      )}
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
                            <AreaCard
                              area={area.data}
                              key={area.data.id}
                              className="c-areas__item"
                              subtitleKey="teams.managedBy"
                              subtitleValue={{
                                name:
                                  areasInTeam?.team?.id &&
                                  teamMembers?.[areasInTeam?.team?.id]?.find(
                                    member => member.attributes.role === "administrator"
                                  )?.attributes?.name
                              }}
                            />
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
            onClose={() => history.goBack()}
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
