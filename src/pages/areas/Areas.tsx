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

interface IProps extends TPropsFromRedux {}

const Areas: FC<IProps> = props => {
  const { areasList, loading, loadingTeamAreas, areasInUsersTeams } = props;
  const areaMap = useMemo<TAreasResponse[]>(() => Object.values(areasList), [areasList]);
  const [selectedArea, setSelectedArea] = useState<TAreasResponse | null>(null);
  const intl = useIntl();

  const handleAreaDeselect = useCallback(() => {
    setSelectedArea(null);
  }, []);

  const handleAreaSelect = useCallback(
    (areaId: string) => {
      setSelectedArea(areasList[areaId]);
    },
    [areasList]
  );

  const getNumberOfTeamsInArea = (areaId: string) => {
    let count = 0;
    areasInUsersTeams.forEach(team =>
      team.areas.forEach(area => {
        if (area.data.id === areaId) {
          count++;
        }
      })
    );
    return count;
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
            <UserAreasMap
              className="c-map--within-hero"
              selectedAreaId={selectedArea?.id}
              onAreaSelect={handleAreaSelect}
              onAreaDeselect={handleAreaDeselect}
            >
              {selectedArea && (
                <AreaDetailCard area={selectedArea} numberOfTeams={getNumberOfTeamsInArea(selectedArea.id)} />
              )}
            </UserAreasMap>
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
            {areaMap.map((area: TAreasResponse) => (
              <AreaCard area={area} key={area.id} className="c-areas__item" />
            ))}
          </div>
        </Article>
      </div>
      <div className="l-content">
        <Article title="areas.teamSubtitle">
          {areasInUsersTeams.map(
            areasInTeam =>
              areasInTeam.team && (
                <Fragment key={areasInTeam.team.id}>
                  <h3 className="u-text-600 u-text-neutral-700">{areasInTeam.team.attributes?.name}</h3>

                  <div className="c-areas__area-listing">
                    {areasInTeam.areas.map(area => (
                      <AreaCard area={area.data} key={area.data.id} className="c-areas__item" />
                    ))}
                  </div>
                </Fragment>
              )
          )}
        </Article>
        <Loader isLoading={loadingTeamAreas} />
      </div>
    </div>
  );
};
export default Areas;
