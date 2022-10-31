import List from "components/extensive/List";
import LayersCardItem from "./LayersCardItem";
import { Layers } from "generated/clayers/clayersResponses";
import { usePatchContextualLayer } from "generated/clayers/clayersComponents";
import LoadingWrapper from "components/extensive/LoadingWrapper";

type LayersCardProps = {
  title: string;
  items: Layers["data"];
  refetchLayers: () => void;
  layersLoading: boolean;
};

const LayersCard = ({ title, items, refetchLayers, layersLoading }: LayersCardProps) => {
  const { mutateAsync: updateLayer, isLoading: updateLayerLoading } = usePatchContextualLayer();

  const canBeLoadable = items.some(item => !item.attributes?.isPublic);
  const loading = canBeLoadable ? layersLoading : false;

  return (
    <section className="my-7">
      {/* Title */}
      <div className="bg-green-400 border-2 border-solid border-green-500 py-7 px-6 rounded-t-[4px] border-opacity-20">
        <p className="text-[24px] text-gray-700 font-[400]">{title}</p>
      </div>
      {/* Content */}
      <div className="bg-gray-300 py-7 px-6 border-2 border-solid border-gray-500 border-opacity-40 rounded-b-[4px]">
        <LoadingWrapper loading={updateLayerLoading || loading} className="py-10 relative">
          <List
            items={items}
            render={(item, index) => (
              <LayersCardItem
                refetchLayers={refetchLayers}
                updateLayer={updateLayer}
                // @ts-expect-error
                item={item}
                isLast={index === items.length - 1}
              />
            )}
          />
        </LoadingWrapper>
      </div>
    </section>
  );
};

export default LayersCard;
