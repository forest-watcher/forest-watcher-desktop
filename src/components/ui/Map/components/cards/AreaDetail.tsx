import { FC } from "react";
import { TAreasResponse } from "services/area";
import MapCard from "./MapCard";

interface IParams {
  area: TAreasResponse;
}

const AreaDetailCard: FC<IParams> = ({ area }) => {
  return <MapCard title={area.attributes.name}></MapCard>;
};

export default AreaDetailCard;
