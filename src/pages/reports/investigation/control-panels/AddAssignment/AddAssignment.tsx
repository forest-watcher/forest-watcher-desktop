import { AllGeoJSON } from "@turf/turf";
import Button from "components/ui/Button/Button";
import MapCard from "components/ui/Map/components/cards/MapCard";
import useFindArea from "hooks/useFindArea";
import useZoomToGeojson from "hooks/useZoomToArea";
import OpenAssignmentEmptyState from "pages/reports/investigation/control-panels/AddAssignment/states/EmptyState";
import { TParams } from "pages/reports/investigation/types";
import { FC, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation, useParams } from "react-router-dom";

export interface IProps {}

const AddAssignmentControlPanel: FC<IProps> = props => {
  const {} = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { areaId } = useParams<TParams>();

  // ToDo: Move this to src/pages/reports/investigation/Investigation.tsx to avoid boiler plate code
  const area = useFindArea(areaId);
  const selectedAreaGeoData = useMemo(() => area?.attributes.geostore.geojson, [area]);
  //@ts-ignore
  useZoomToGeojson(selectedAreaGeoData as AllGeoJSON);

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "assignment.create" })}
      onBack={() => {
        history.push(location.pathname.replace("/assignment", ""));
      }}
      footer={
        <Button disabled>
          <FormattedMessage id="assignment.create" />
        </Button>
      }
    >
      {/* ToDo: Currently always displays */}
      <OpenAssignmentEmptyState />
    </MapCard>
  );
};

export default AddAssignmentControlPanel;
