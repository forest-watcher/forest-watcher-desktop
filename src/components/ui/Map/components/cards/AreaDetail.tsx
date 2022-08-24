import classNames from "classnames";
import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { TAreasResponse } from "services/area";
import MapCard, { positions } from "./MapCard";

interface IParams {
  area?: TAreasResponse;
  numberOfTeams: number;
  numberOfReports?: number;
  className?: string;
  position?: positions;
  onBack?: () => void;
}

const AreaDetailCard: FC<IParams> = ({
  area,
  numberOfTeams,
  className,
  position = "bottom-right",
  onBack,
  numberOfReports
}) => {
  const intl = useIntl();
  return (
    <MapCard
      title={intl.formatMessage({ id: "areas.card.title" }, { name: area?.attributes.name })}
      position={position}
      className={classNames("c-map-card--area-detail", className)}
      footer={
        area && (
          <>
            <Link to={`/reporting/investigation/${area.id}/start`} className="c-button c-button--primary">
              <FormattedMessage id="investigation.start" />
            </Link>
            <Link to={`/areas/${area.id}`} className="c-button c-button--secondary">
              <FormattedMessage id="areas.manageArea" />
            </Link>
          </>
        )
      }
      onBack={onBack}
    >
      {area && (
        <ul className="c-card__text c-card__list">
          <li>
            <FormattedMessage
              id="areas.card.size"
              values={{ size: (area.attributes.geostore.areaHa * 10000).toFixed(0) }}
            />
          </li>
          <li>
            <FormattedMessage id="areas.card.reports" values={{ num: numberOfReports }} />
          </li>
          <li>
            <FormattedMessage id="areas.card.teams" values={{ num: numberOfTeams }} />
          </li>
        </ul>
      )}
    </MapCard>
  );
};

export default AreaDetailCard;
