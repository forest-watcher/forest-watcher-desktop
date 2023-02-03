import OptionalWrapper from "components/extensive/OptionalWrapper";
import { FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Layer, Source } from "react-map-gl";
import { useRouteMatch } from "react-router-dom";
import { TParams } from "../types";
import { allDeforestationAlerts, EAlertTypes } from "constants/alerts";

// Map Sources
import AreaAssignmentSource from "./AreaAssignmentSource";
import AreaAlertsSource from "./AreaAlertSource";
import AreaRoutesSource from "./AreaRoutesSource";

interface IProps {
  contextualLayerUrls: string[];
  lockAlertSelections: boolean;
}

const Layers: FC<IProps> = ({ contextualLayerUrls, lockAlertSelections }) => {
  let investigationMatch = useRouteMatch<TParams>({ path: "/reporting/investigation/:areaId/start", exact: false });
  const { control } = useFormContext();
  const watcher = useWatch({ control });

  return (
    <OptionalWrapper data={!!investigationMatch}>
      {contextualLayerUrls.map(url => (
        <Source id={url} type="raster" tiles={[url]} key={url}>
          <Layer id={`${url}-layer`} type="raster" />
        </Source>
      ))}

      {watcher.showAlerts.includes("true") && (
        <AreaAlertsSource
          areaId={investigationMatch?.params.areaId}
          alertTypesToShow={watcher.alertTypesShown === "all" ? allDeforestationAlerts : [watcher.alertTypesShown]}
          alertRequestThreshold={
            watcher.alertTypesShown !== EAlertTypes.VIIRS
              ? watcher.alertTypesRequestThreshold
              : watcher.alertTypesViirsRequestThreshold
          }
          locked={lockAlertSelections}
        />
      )}

      {watcher.showOpenAssignments.includes("true") && (
        <AreaAssignmentSource areaId={investigationMatch?.params.areaId} />
      )}

      {watcher.showRoutes.includes("true") && <AreaRoutesSource areaId={investigationMatch?.params.areaId} />}
    </OptionalWrapper>
  );
};

export default Layers;
