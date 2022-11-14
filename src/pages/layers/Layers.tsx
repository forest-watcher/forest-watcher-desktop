import { useAccessToken } from "hooks/useAccessToken";
import LayersSection, { ILayersSection } from "./components/LayersSection";
import { useGetContextualLayer } from "../../generated/clayers/clayersComponents";
import { Layers as ILayers } from "../../generated/clayers/clayersResponses";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useMemo } from "react";
import List from "components/extensive/List";
import Hero from "components/layouts/Hero/Hero";

const Layers = () => {
  const { httpAuthHeader } = useAccessToken();
  const {
    data: layersData,
    isLoading: layersLoading,
    isFetching: layersFetching,
    refetch: refetchLayers
  } = useGetContextualLayer({ headers: httpAuthHeader });

  const layers: { pub?: ILayers["data"]; user?: ILayers["data"] } = useMemo(() => {
    const pub = layersData?.data.filter(l => l.attributes && l.attributes.isPublic);
    const user = layersData?.data.filter(
      l => l.attributes && !l.attributes.isPublic && l.attributes.owner.type === "USER"
    );

    return { pub, user };
  }, [layersData]);

  const sections = useMemo(
    () =>
      [
        {
          title: "layers.publicLayers.title",
          subtitle: "layers.publicLayers.subtitle",
          cardTitle: "layers.publicLayers.card.title",
          cardItems: layers.pub ?? []
        },
        {
          title: "layers.userLayers.title",
          subtitle: "layers.userLayers.subtitle",
          cardTitle: "layers.userLayers.card.title",
          cardItems: layers.user ?? []
        }
      ] as ILayersSection[],
    [layers]
  );

  return (
    <section>
      <Hero title={"settings.layers"} />
      <LoadingWrapper loading={layersLoading}>
        <List
          items={sections}
          render={item => (
            <LayersSection {...item} refetchLayers={refetchLayers} layersLoading={layersLoading || layersFetching} />
          )}
          itemClassName="even:bg-neutral-400"
        />
      </LoadingWrapper>
    </section>
  );
};

export default Layers;
