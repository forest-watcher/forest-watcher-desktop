import MapCard from "components/ui/Map/components/cards/MapCard";
import { FC } from "react";

export interface IProps {
  selectedAlerts: any[];
}

const AlertsDetailCard: FC<IProps> = props => {
  const { selectedAlerts } = props;

  return <MapCard title="Test" position="bottom-right" />;
};

export default AlertsDetailCard;
