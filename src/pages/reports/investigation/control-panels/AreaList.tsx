import { FC, useMemo } from "react";
import { useAppSelector } from "hooks/useRedux";
import { RouteComponentProps, useLocation } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Card from "components/ui/Card/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Loader from "components/ui/Loader";
import useUrlQuery from "hooks/useUrlQuery";

interface IProps extends RouteComponentProps {}

const AreaListAreaCard: FC<{ area: any; teamId?: string }> = ({ area, teamId }) => {
  const intl = useIntl();
  const location = useLocation();
  const urlQuery = useUrlQuery();
  const scrollToAreaId = useMemo(() => urlQuery.get("scrollToAreaId"), [urlQuery]);
  const scrollToTeamId = useMemo(() => urlQuery.get("scrollToTeamId"), [urlQuery]);

  const areaCreatedDate = new Date(area.attributes.createdAt);
  const day = ("0" + areaCreatedDate.getDate()).slice(-2),
    month = intl.formatMessage({ id: `common.date.month.${areaCreatedDate.getMonth()}` }),
    year = areaCreatedDate.getFullYear();

  const handleCardRef = (id: string, el: HTMLDivElement | null) => {
    if (id === scrollToAreaId && el && (teamId === scrollToTeamId || (!teamId && scrollToTeamId === null))) {
      // @ts-ignore Not a standard function.
      if (el.scrollIntoViewIfNeeded) {
        // @ts-ignore Not a standard function.
        el.scrollIntoViewIfNeeded();
      } else {
        el.scrollIntoView();
      }
    }
  };

  return (
    <div className="c-map-control-panel__grid-item" ref={el => handleCardRef(area.id, el)}>
      <Card className="c-map-control-panel__area-card" size="small">
        <Card.Image
          alt=""
          src={area.attributes.image}
          loading="lazy"
          className="c-area-card__image c-map-control-panel__area-card-image"
        />
        <div className="c-map-control-panel__area-card-content">
          <Card.Title className="u-margin-top-none">{area.attributes.name}</Card.Title>
          <Card.Text className="u-margin-top-none">
            <FormattedMessage id="reporting.control.panel.area.created.at">
              {txt => <>{`${txt} ${day} ${month} ${year}`}</>}
            </FormattedMessage>
          </Card.Text>
          <Card.Cta to={`${location.pathname}/${area.id}${teamId ? `?scrollToTeamId=${teamId}` : ""}`} />
        </div>
      </Card>
    </div>
  );
};

const AreaListControlPanel: FC<IProps> = props => {
  const intl = useIntl();
  const {
    data: areas,
    areasInUsersTeams,
    loading: isLoadingAreas,
    loadingAreasInUsers: isLoadingAreasInUsers
  } = useAppSelector(state => state.areas);

  const teamAreas = useMemo(() => {
    const teamAreasMapped = [];

    for (const areasInUsersTeam of areasInUsersTeams) {
      if (areasInUsersTeam.areas.length) {
        teamAreasMapped.push({
          team: areasInUsersTeam.team,
          areas: [...areasInUsersTeam.areas]
        });
      }
    }

    return teamAreasMapped;
  }, [areasInUsersTeams]);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "reporting.control.panel.area.list.title" })}
    >
      <Loader isLoading={isLoadingAreas} />
      <h3 className="c-map-control-panel__sub-title">
        <FormattedMessage id="reporting.control.panel.area.list.your.areas" />
      </h3>
      <div className="c-map-control-panel__grid">
        {Object.values<any>(areas)
          .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name.toString()))
          .map(area => (
            <AreaListAreaCard key={area.id} area={area} />
          ))}
      </div>

      {!isLoadingAreas && (isLoadingAreasInUsers || Boolean(teamAreas.length)) && (
        <div className="c-map-control-panel__team-areas">
          <Loader isLoading={isLoadingAreasInUsers} />

          <h3 className="c-map-control-panel__sub-title">
            <FormattedMessage id="reporting.control.panel.area.list.team.areas" />
          </h3>
          {teamAreas.map(
            teamArea =>
              teamArea.team && (
                <div className="u-margin-bottom-24" key={teamArea.team?.id}>
                  <h4 className="c-map-control-panel__team-name">{teamArea.team?.attributes?.name}</h4>
                  <div className="c-map-control-panel__grid">
                    {[...teamArea.areas]
                      .sort((a, b) => a.data.attributes.name.localeCompare(b.data.attributes.name.toString()))
                      .map(({ data: area }) => (
                        <AreaListAreaCard key={area.id} area={area} teamId={teamArea.team?.id} />
                      ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </MapCard>
  );
};

export default AreaListControlPanel;
