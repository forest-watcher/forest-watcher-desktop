import { useAccessToken } from "hooks/useAccessToken";
import LayersHeader from "./components/LayersHeader";
import LayersSection, { ILayersSection } from "./components/LayersSection";
import { useGetContextualLayer } from "../../generated/clayers/clayersComponents";
import { Layers as ILayers } from "../../generated/clayers/clayersResponses";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useMemo } from "react";
import List from "components/extensive/List";

const Layers = () => {
  const { httpAuthHeader } = useAccessToken();
  const { data: layersData, isLoading: layersLoading } = useGetContextualLayer({ headers: httpAuthHeader });

  const layers: { pub?: ILayers["data"]; team?: ILayers["data"]; user?: ILayers["data"] } = useMemo(() => {
    const pub = layersData?.data.filter(l => l.attributes && l.attributes.isPublic);
    const team = layersData?.data.filter(
      l => l.attributes && !l.attributes.isPublic && l.attributes.owner.type === "TEAM"
    );
    const user = layersData?.data.filter(
      l => l.attributes && !l.attributes.isPublic && l.attributes.owner.type === "USER"
    );

    return { pub, team, user };
  }, [layersData]);

  const sections = useMemo(
    () =>
      [
        {
          title: "settings.publicLayers",
          subtitle: "Public layers are always available in the map.",
          cardTitle: "Available Layers:",
          cardItems: layers.pub ?? []
        },
        {
          title: "settings.userLayers",
          subtitle: "Select up to 3 additional contextual layers.",
          cardTitle: "My Layers",
          cardItems: layers.user ?? []
        },
        {
          title: "settings.teamLayers",
          subtitle: "Select up to 3 additional contextual layers to show to your teams.",
          cardTitle: "Team 1",
          cardItems: layers.team ?? []
        }
      ] as ILayersSection[],
    [layers]
  );

  return (
    <section>
      <LayersHeader />
      <LoadingWrapper loading={layersLoading}>
        <List items={sections} render={item => <LayersSection {...item} />} itemClassName="even:bg-gray-400" />
      </LoadingWrapper>
    </section>
  );
};

export default Layers;
