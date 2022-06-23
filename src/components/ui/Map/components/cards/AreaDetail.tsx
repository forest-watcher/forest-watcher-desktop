import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { TAreasResponse } from "services/area";
import MapCard from "./MapCard";

interface IParams {
  area: TAreasResponse;
}

const AreaDetailCard: FC<IParams> = ({ area }) => {
  const intl = useIntl();
  return (
    <MapCard
      title={intl.formatMessage({ id: "areas.card.title" }, { name: area.attributes.name })}
      position="bottom-right"
      className="c-map-card--area-detail"
      footer={
        <>
          <Link to="/reporting/investigation" className="c-button c-button--primary">
            <FormattedMessage id="investigation.start" />
          </Link>
          <Link to={`/areas/${area.id}`} className="c-button c-button--secondary">
            <FormattedMessage id="areas.manageArea" />
          </Link>
        </>
      }
    >
      <ul className="c-card__text c-card__list">
        <li>
          <FormattedMessage
            id="areas.card.size"
            values={{ size: (area.attributes.geostore.areaHa * 10000).toFixed(0) }}
          />
        </li>
        <li>
          <FormattedMessage id="areas.card.reports" values={{ num: 0 }} />
        </li>
        <li>
          <FormattedMessage id="areas.card.teams" values={{ num: 0 }} />
        </li>
      </ul>
    </MapCard>
  );
};

export default AreaDetailCard;
