import { FormattedMessage, useIntl } from "react-intl";
import { getRoutePoints } from "./AreaRoutesSource";
import * as turf from "@turf/turf";
import { FC } from "react";
import { RouteResponse } from "generated/core/coreResponses";
import MapCard from "components/ui/Map/components/cards/MapCard";
import { capitalizeFirstLetter } from "helpers/string";
import moment from "moment";
import { useGetV3GfwTeamsTeamId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useAppSelector } from "hooks/useRedux";
import ReactDOM from "react-dom";

interface IProps {
  route: RouteResponse["data"];
  onClose: () => void;
}

const RouteCard: FC<IProps> = ({ route, onClose }) => {
  const intl = useIntl();
  const portal = useAppSelector(state => state.layers.portal);
  const { httpAuthHeader } = useAccessToken();
  const { data: teamData } = useGetV3GfwTeamsTeamId(
    {
      headers: httpAuthHeader,
      pathParams: { teamId: route?.attributes?.teamId || "" }
    },
    { enabled: Boolean(route?.attributes?.teamId) }
  );

  if (!route) {
    return null;
  }

  const routePoints = getRoutePoints(route);
  const line = turf.lineString(routePoints);
  const start = routePoints[0];
  const end = routePoints[routePoints.length - 1];
  const length = turf.length(line, { units: "kilometers" }).toFixed(1);

  const content = (
    <MapCard
      title={route.attributes?.name || ""}
      titleIconName="Routes"
      position="bottom-right"
      onOutsideClick={onClose}
    >
      <ul className="c-card__text c-card__list">
        <li>
          <FormattedMessage id="route.type" />
        </li>
        <li>
          <FormattedMessage
            id="route.start"
            values={{
              value: `${start[0]?.toFixed(4)}, ${start[1].toFixed(4)}`
            }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.end"
            values={{
              value: `${end[0].toFixed(4)}, ${end[1].toFixed(4)}`
            }}
          />
        </li>
        <li>
          <FormattedMessage id="route.distance" values={{ value: length }} />
        </li>
        <li>
          <FormattedMessage
            id="route.date"
            values={{
              value: intl.formatDate(route.attributes?.startDate, { month: "short", day: "2-digit", year: "numeric" })
            }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.difficulty"
            values={{ value: intl.formatMessage({ id: `route.difficulty.${route.attributes?.difficulty}` }) }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.timeTaken"
            values={{
              value: capitalizeFirstLetter(
                moment.duration(moment(route.attributes?.endDate).diff(moment(route.attributes?.startDate))).humanize()
              )
            }}
          />
        </li>
        <li>
          <FormattedMessage
            id="route.monitor"
            values={{
              value: teamData
                ? `${route.attributes?.username} (${teamData.data?.attributes?.name})`
                : route.attributes?.username
            }}
          />
        </li>
      </ul>
    </MapCard>
  );

  return portal ? ReactDOM.createPortal(content, portal) : content;
};

export default RouteCard;
