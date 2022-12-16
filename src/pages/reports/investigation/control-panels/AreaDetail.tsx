import { AllGeoJSON } from "@turf/turf";
import AreaDetailCard from "components/ui/Map/components/cards/AreaDetail";
import { fireGAEvent } from "helpers/analytics";
import useGetAreas from "hooks/querys/areas/useGetAreas";
import useUrlQuery from "hooks/useUrlQuery";
import useZoomToGeojson from "hooks/useZoomToArea";
import { TParams } from "pages/reports/investigation/types";
import { FC, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { MonitoringActions, MonitoringLabel } from "types/analytics";

interface IAreaCardProps {
  numberOfReports?: number;
}

const AreaDetailControlPanel: FC<IAreaCardProps> = ({ numberOfReports }) => {
  const { areaId } = useParams<TParams>();
  const history = useHistory();
  const urlQuery = useUrlQuery();
  const scrollToTeamId = useMemo(() => urlQuery.get("scrollToTeamId"), [urlQuery]);
  const {
    data: { unfilteredAreas, getTeamNamesByAreaId }
  } = useGetAreas();

  const area = useMemo(() => unfilteredAreas?.data?.find(area => area.id === areaId), [areaId, unfilteredAreas?.data]);

  const selectedAreaGeoData = useMemo(() => area?.attributes?.geostore?.geojson, [area]);

  //@ts-ignore
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);

  if (!area) {
    return null;
  }

  return (
    <AreaDetailCard
      className="c-map-control-panel"
      area={area}
      teamNames={getTeamNamesByAreaId(areaId)}
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
  );
};

export default AreaDetailControlPanel;
