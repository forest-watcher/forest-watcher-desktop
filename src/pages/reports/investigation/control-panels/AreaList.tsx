import { FC, useMemo } from "react";
import { useAppSelector } from "hooks/useRedux";
import { RouteComponentProps, useLocation } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";
import Card from "components/ui/Card/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Loader from "components/ui/Loader";
import useUrlQuery from "hooks/useUrlQuery";
import useGetAreas from "hooks/querys/areas/useGetAreas";

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
    data: { userAreas, areasByTeam },
    isLoading: isLoadingAreas
  } = useGetAreas();

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
        {[...userAreas]
          .sort((a, b) => {
            const aStr = a.attributes?.name || "";
            const bStr = b.attributes?.name || "";

            return aStr.localeCompare(bStr.toString());
          })
          .map(area => (
            <AreaListAreaCard key={area.id} area={area} />
          ))}
      </div>

      {!isLoadingAreas && Boolean(areasByTeam.length) && (
        <div className="c-map-control-panel__team-areas">
          <h3 className="c-map-control-panel__sub-title">
            <FormattedMessage id="reporting.control.panel.area.list.team.areas" />
          </h3>
          {areasByTeam.map(
            teamArea =>
              teamArea.team && (
                // @ts-ignore incorrect typings
                <div className="u-margin-bottom-24" key={teamArea.team?.id}>
                  {/* @ts-ignore incorrect typings */}
                  <h4 className="c-map-control-panel__team-name">{teamArea.team?.name}</h4>
                  <div className="c-map-control-panel__grid">
                    {[...(teamArea.areas || [])]
                      .sort((a, b) => {
                        const aStr = a.data?.attributes?.name || "";
                        const bStr = b.data?.attributes?.name || "";

                        return aStr.localeCompare(bStr.toString());
                      })
                      .map(({ data: area }) => (
                        // @ts-ignore incorrect typings
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
