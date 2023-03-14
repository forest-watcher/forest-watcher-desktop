import useGetUserTeams from "hooks/querys/teams/useGetUserTeams";
import LayersCard from "./LayersCard";
import { Layers } from "generated/clayers/clayersResponses";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Article from "components/layouts/Article";
import List from "components/extensive/List";
import { useMemo } from "react";

export interface ILayersSection {
  title: string;
  subtitle: string;
  cardTitle?: string;
  cardItems: Layers["data"];
  className?: string;
  type: "PUBLIC" | "TEAMS" | "USER";
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
  const { data: teams } = useGetUserTeams({ enabled: type === "TEAMS" });

  const isTeams = type === "TEAMS";
  const shouldShow = (isTeams && teams && teams.length > 0) || !isTeams;

  const layersByTeam = useMemo(() => {
    const layers =
      teams?.map(team => {
        return {
          team,
          // @ts-ignore type incorrect
          layers: cardItems.filter(item => item.attributes?.owner.id === team.id)
        };
      }, []) || [];

    return layers;
  }, [cardItems, teams]);

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
            type={type}
          />
        )}
      </Article>
    </OptionalWrapper>
  );
};

export default LayersSection;
