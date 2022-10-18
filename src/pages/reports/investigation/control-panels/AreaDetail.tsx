import { AllGeoJSON } from "@turf/turf";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import { fireGAEvent } from "helpers/analytics";
import { getAreaTeams } from "helpers/areas";
import useFindArea from "hooks/useFindArea";
import useUrlQuery from "hooks/useUrlQuery";
import useZoomToGeojson from "hooks/useZoomToArea";
import { TParams } from "pages/reports/investigation/types";
import { FC, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { TAreasInTeam } from "services/area";
import { MonitoringActions, MonitoringLabel } from "types/analytics";

interface IAreaCardProps {
  areasInUsersTeams: TAreasInTeam[];
  numberOfReports?: number;
}

const AreaDetailControlPanel: FC<IAreaCardProps> = ({ areasInUsersTeams, numberOfReports }) => {
  const { areaId } = useParams<TParams>();
  const urlQuery = useUrlQuery();
  const scrollToTeamId = useMemo(() => urlQuery.get("scrollToTeamId"), [urlQuery]);

  const history = useHistory();

  const area = useFindArea(areaId);

  const selectedAreaGeoData = useMemo(() => area?.attributes.geostore.geojson, [area]);
  //@ts-ignore
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);
  return (
    area && (
      <AreaDetailCard
        className="c-map-control-panel"
        area={area}
        teams={getAreaTeams(area.id, areasInUsersTeams)}
        numberOfReports={numberOfReports}
        position="top-left"
        onBack={() =>
          history.push(
            `/reporting/investigation?scrollToAreaId=${areaId}${
              scrollToTeamId ? `&scrollToTeamId=${scrollToTeamId}` : ""
            }`
          )
        }
        onStartInvestigation={() =>
          fireGAEvent({
            category: "Monitoring",
            action: MonitoringActions.Investigation,
            label: MonitoringLabel.StartedInvestigation
          })
        }
        onManageArea={() =>
          fireGAEvent({
            category: "Monitoring",
            action: MonitoringActions.ManagedArea,
            label: MonitoringLabel.StartedFromMonitoring
          })
        }
      />
    )
  );
};

export default AreaDetailControlPanel;
