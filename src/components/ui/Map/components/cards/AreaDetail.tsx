import classNames from "classnames";
import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { TAreasResponse } from "services/area";
import { TeamResponse } from "services/teams";
import MapCard, { positions } from "./MapCard";

interface IParams {
  area?: TAreasResponse;
  teams: TeamResponse["data"][];
  numberOfReports?: number;
  className?: string;
  position?: positions;
  onBack?: () => void;
  onStartInvestigation?: () => void;
  onManageArea?: () => void;
}

const AreaDetailCard: FC<IParams> = ({
  area,
  teams,
  className,
  position = "bottom-right",
  onBack,
  numberOfReports,
  onStartInvestigation,
  onManageArea
}) => {
  return (
    <MapCard
      title={area?.attributes.name || ""}
      titleIconName="mapCardIcons/Areas"
      position={position}
      className={classNames("c-map-card--area-detail", className)}
      footer={
        area && (
          <>
            <Link
              to={`/reporting/investigation/${area.id}/start`}
              className="c-button c-button--primary"
              onClick={onStartInvestigation}
            >
              <FormattedMessage id="investigation.start" />
            </Link>
            <Link to={`/areas/${area.id}`} className="c-button c-button--secondary" onClick={onManageArea}>
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
            <FormattedMessage id="areas.card.type" />
          </li>
          <li>
            <FormattedMessage
              id="areas.card.size"
              values={{ size: (area.attributes.geostore.areaHa / 100).toFixed(2) }}
            />
          </li>
          <li>
            <FormattedMessage id="areas.card.reports" values={{ num: numberOfReports }} />
          </li>
          {teams.length > 0 && (
            <li className="u-text-break-word">
              <FormattedMessage
                id="areas.card.teams"
                values={{ num: teams.map(team => team?.attributes?.name).join(", ") }}
              />
            </li>
          )}
        </ul>
      )}
    </MapCard>
  );
};

export default AreaDetailCard;
