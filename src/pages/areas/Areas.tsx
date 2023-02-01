import useGetAllReportAnswersForUser from "hooks/querys/reportAnwsers/useGetAllReportAnswersForUser";
import useGetTeamMembers from "hooks/querys/teams/useGetTeamMembers";
import { FC, useMemo, useState, Fragment, useCallback, useEffect } from "react";
import Hero from "components/layouts/Hero/Hero";
import Article from "components/layouts/Article";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import EmptyState from "components/ui/EmptyState/EmptyState";
import PlusIcon from "assets/images/icons/PlusWhite.svg";
import { TPropsFromRedux } from "./AreasContainer";
import AreaCard from "components/area-card/AreaCard";
import UserAreasMap from "components/user-areas-map/UserAreasMap";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import AreaIcon from "assets/images/icons/EmptyAreas.svg";
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
import AreasOnboarding from "components/onboarding/monitoring/AreasOnboarding";
import useGetAreas from "hooks/querys/areas/useGetAreas";
import { AreaResponse } from "generated/core/coreResponses";

interface IProps extends TPropsFromRedux {
  getTeamMembers: (teamId: string) => void;
}

const Areas: FC<IProps> = props => {
  const {
    data: { userAreas, areasByTeam, unfilteredAreas, getTeamNamesByAreaId },
    isLoading
  } = useGetAreas();

  const areaCount = useMemo(() => [...userAreas, ...areasByTeam].length, [areasByTeam, userAreas]);
  const hasTeamAreas = useMemo(() => {
    return areasByTeam.length > 0;
  }, [areasByTeam.length]);

  const [selectedArea, setSelectedArea] = useState<AreaResponse["data"] | null>(null);
  const [mapRef, setMapRef] = useState<MapInstance | null>(null);
  const [currentBoundsStr, setCurrentBoundsStr] = useState("");

  /*
   * Queries
   */
  // Fetch all Report Answers
  const { data: allAnswers } = useGetAllReportAnswersForUser();
  // Fetch all the Team members for each Team Area
  const teamMembers = useGetTeamMembers(
    areasByTeam?.map(area => {
      // @ts-ignore `id` not typed
      return area?.team?.id;
    }) || []
  );

  // Find all the Team Admin Names
  const teamAdminNames = useMemo(() => {
    return teamMembers.reduce<Record<string, string>>((acc, { data: team, isLoading, isError }) => {
      if (isLoading || isError || !team.teamId) {
        return acc;
      }

      console.log("OE");

      acc[team.teamId] =
        team.members?.find(member => member.attributes?.role === "administrator")?.attributes?.name || "";

      return acc;
    }, {});
  }, [teamMembers]);

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
      setSelectedArea(unfilteredAreas?.data?.find(area => area.id === areaId) || null);
    },
    [unfilteredAreas?.data]
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

  return (
    <div className="c-areas">
      <AreasOnboarding />
      <Hero
        title="areas.name"
        actions={
          <Link
            className={classNames(
              "c-button c-button--primary",
              areaCount === 0 && !hasTeamAreas && "c-button--disabled"
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
      {isLoading ? (
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
          showTeamAreas
          alwaysHideKeyLegend
        >
          {selectedArea && (
            <AreaDetailCard
              area={selectedArea}
              teamNames={selectedArea.id ? getTeamNamesByAreaId(selectedArea.id) : []}
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
        {areaCount === 0 && !isLoading ? (
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
              {[...userAreas]
                .sort((a, b) => {
                  const aStr = a.attributes?.name || "";
                  const bStr = b.attributes?.name || "";

                  return aStr.localeCompare(bStr.toString());
                })
                .map(area => (
                  <AreaCard area={area} key={area.id} className="c-areas__item" />
                ))}
            </div>
          </Article>
        )}
      </div>
      {isLoading && (
        <div className="l-content">
          <Loader isLoading />
        </div>
      )}
      {hasTeamAreas && (
        <div className="l-content">
          {areasByTeam && !isLoading && (
            <Article title="areas.teamSubtitle">
              {areasByTeam.map(
                areasInTeam =>
                  areasInTeam.team &&
                  (areasInTeam?.areas?.length || 0) > 0 && (
                    // @ts-ignore
                    <Fragment key={areasInTeam.team.id}>
                      {/* @ts-ignore */}
                      <h3 className="u-text-600 u-text-neutral-700">{areasInTeam.team.name}</h3>

                      <div className="c-areas__area-listing">
                        {/* @ts-ignore */}
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
                                  // @ts-ignore
                                  areasInTeam?.team?.id && teamAdminNames[areasInTeam?.team?.id]
                              }}
                            />
                          ))}
                      </div>
                    </Fragment>
                  )
              )}
            </Article>
          )}
          <Loader isLoading={isLoading} />
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
