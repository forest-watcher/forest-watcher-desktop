import MapCard from "components/ui/Map/components/cards/MapCard";
import { FC } from "react";
import { useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";

export interface IProps {}

const AddAssignmentControlPanel: FC<IProps> = props => {
  const {} = props;
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();

  return (
    <MapCard
      className="c-map-control-panel"
      title={intl.formatMessage({ id: "assignment.create" })}
      onBack={() => {
        history.push(location.pathname.replace("/assignment", ""));
      }}
    ></MapCard>
  );
};

export default AddAssignmentControlPanel;
