import LayersCard from "./LayersCard";
import { Layers } from "generated/clayers/clayersResponses";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Article from "components/layouts/Article";
import { useGetV3GfwTeamsUserUserId } from "generated/core/coreComponents";
import useGetUserId from "hooks/useGetUserId";
import { useAccessToken } from "hooks/useAccessToken";
import List from "components/extensive/List";
import { useIntl } from "react-intl";
import EmptyState from "components/ui/EmptyState/EmptyState";

export interface ILayersSection {
  title: string;
  subtitle: string;
  cardTitle?: string;
  cardItems: Layers["data"];
  className?: string;
  type: "PUBLIC" | "TEAMS";
}

interface ILayersSectionProps extends ILayersSection {
  refetchLayers: () => void;
  layersLoading: boolean;
}

const LayersSection = ({
  title,
  subtitle,
  cardTitle,
  cardItems,
  className,
  refetchLayers,
  layersLoading,
  type
}: ILayersSectionProps) => {
  // Get teams if the type is teams
  const userId = useGetUserId();
  const intl = useIntl();
  const { httpAuthHeader } = useAccessToken();

  const { data: teams } = useGetV3GfwTeamsUserUserId(
    { pathParams: { userId }, headers: httpAuthHeader },
    { enabled: type === "TEAMS" }
  );

  const isTeams = type === "TEAMS";
  const shouldShow = (isTeams && teams?.data && teams.data.length > 0) || !isTeams;

  return (
    <OptionalWrapper data={shouldShow}>
      <Article className={className} title={title} subtitle={subtitle}>
        {isTeams ? (
          <List
            items={teams?.data || []}
            render={item => (
              <LayersCard
                title={`${item.attributes?.name}:`}
                titleIsKey={false}
                items={cardItems}
                refetchLayers={refetchLayers}
                layersLoading={layersLoading}
                team={item}
              />
            )}
          />
        ) : (
          <LayersCard
            title={cardTitle || ""}
            items={cardItems}
            refetchLayers={refetchLayers}
            layersLoading={layersLoading}
          />
        )}
      </Article>
    </OptionalWrapper>
  );
};

export default LayersSection;
