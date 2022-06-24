import { FC } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "hooks/useRedux";
import { RouteComponentProps } from "react-router-dom";
import MapCard from "components/ui/Map/components/cards/MapCard";

interface IProps extends RouteComponentProps {}

const AreaListControlPanel: FC<IProps> = props => {
  const { match } = props;
  const { data: areas } = useAppSelector(state => state.areas);

  return (
    <MapCard className="c-map-control-panel" title="Select An Area">
      {Object.values<any>(areas).map(area => (
        <Link to={`${match.url}/${area.id}`} className="c-button c-button--primary">
          {area.attributes.name}
        </Link>
      ))}
    </MapCard>
  );
};

export default AreaListControlPanel;
