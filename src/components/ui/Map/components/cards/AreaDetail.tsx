import classNames from "classnames";
import { AreaResponse } from "generated/core/coreResponses";
import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import MapCard, { positions } from "./MapCard";

interface IParams {
  area?: AreaResponse["data"];
  teamNames: string[];
  numberOfReports?: number;
  className?: string;
  position?: positions;
  onBack?: () => void;
  onStartInvestigation?: () => void;
  onManageArea?: () => void;
}

const AreaDetailCard: FC<IParams> = ({
  area,
  teamNames,
  className,
  position = "bottom-right",
  onBack,
  numberOfReports,
  onStartInvestigation,
  onManageArea
}) => {
  const intl = useIntl();

  return (
    <MapCard
      title={intl.formatMessage({ id: "areas.card.title" }, { name: area?.attributes?.name })}
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
            {area?.attributes?.geostore?.areaHa && (
              <FormattedMessage
                id="areas.card.size"
                values={{ size: (area.attributes.geostore.areaHa / 100).toFixed(2) }}
              />
            )}
          </li>
          <li>
            <FormattedMessage id="areas.card.reports" values={{ num: numberOfReports }} />
          </li>
          {teamNames.length > 0 && (
            <li className="u-text-break-word">
              <FormattedMessage id="areas.card.teams" values={{ num: teamNames.join(", ") }} />
            </li>
          )}
        </ul>
      )}
    </MapCard>
  );
};

export default AreaDetailCard;
