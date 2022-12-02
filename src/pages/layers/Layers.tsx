import { useAccessToken } from "hooks/useAccessToken";
import LayersSection, { ILayersSection } from "./components/LayersSection";
import { useGetV3ContextualLayer } from "../../generated/clayers/clayersComponents";
import { Layers as ILayers } from "../../generated/clayers/clayersResponses";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useEffect, useMemo } from "react";
import List from "components/extensive/List";
import Hero from "components/layouts/Hero/Hero";
import { getGFWLayers } from "modules/layers";
import { useAppDispatch } from "hooks/useRedux";

const Layers = () => {
  const { httpAuthHeader } = useAccessToken();
  const dispatch = useAppDispatch();

  const {
    data: layersData,
    isLoading: layersLoading,
    isFetching: layersFetching,
    refetch: refetchLayers
  } = useGetV3ContextualLayer({ headers: httpAuthHeader });

  const layers: { pub?: ILayers["data"]; teams?: ILayers["data"] } = useMemo(() => {
    const pub = layersData?.data.filter(l => l.attributes && l.attributes.isPublic);
    const teams = layersData?.data.filter(
      l => l.attributes && !l.attributes.isPublic && l.attributes.owner.type === "TEAM"
    );

    return { pub, teams };
  }, [layersData]);

  const sections = useMemo(
    () =>
      [
        {
          title: "layers.publicLayers.title",
          subtitle: "layers.publicLayers.subtitle",
          cardTitle: "layers.publicLayers.card.title",
          cardItems: layers.pub ?? [],
          type: "PUBLIC"
        },
        {
          title: "layers.teamLayers.title",
          subtitle: "layers.teamLayers.subtitle",
          cardItems: layers.teams ?? [],
          type: "TEAMS",
          className: "bg-neutral-400"
        }
      ] as ILayersSection[],
    [layers]
  );

  useEffect(() => {
    dispatch(getGFWLayers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative">
      <Hero title={"settings.layers"} />
      <LoadingWrapper loading={layersLoading}>
        <List
          items={sections}
          render={item => (
            <LayersSection
              {...item}
              className="pt-15 pb-20"
              refetchLayers={refetchLayers}
              layersLoading={layersLoading || layersFetching}
            />
          )}
          itemClassName="even:bg-neutral-400"
        />
      </LoadingWrapper>
    </section>
  );
};

export default Layers;
