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
import { useMemo } from "react";

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
  const { httpAuthHeader } = useAccessToken();

  const { data: teams } = useGetV3GfwTeamsUserUserId(
    { pathParams: { userId }, headers: httpAuthHeader },
    { enabled: type === "TEAMS" }
  );

  const isTeams = type === "TEAMS";
  const shouldShow = (isTeams && teams?.data && teams.data.length > 0) || !isTeams;

  const layersByTeam = useMemo(() => {
    const layers =
      teams?.data?.map(team => {
        return {
          team,
          // @ts-ignore type incorrect
          layers: cardItems.filter(item => item.attributes?.owner.id === team.id)
        };
      }, []) || [];

    return layers;
  }, [cardItems, teams?.data]);

  return (
    <OptionalWrapper data={shouldShow}>
      <Article className={className} title={title} subtitle={subtitle}>
        {isTeams ? (
          <List
            items={layersByTeam || []}
            render={item => (
              <LayersCard
                title={`${item.team.attributes?.name}:`}
                titleIsKey={false}
                items={item.layers}
                refetchLayers={refetchLayers}
                layersLoading={layersLoading}
                team={item.team}
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
