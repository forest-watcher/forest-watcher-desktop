import List from "components/extensive/List";
import LayersCardItem from "./LayersCardItem";
import { Layers } from "generated/clayers/clayersResponses";
import { usePatchContextualLayer } from "generated/clayers/clayersComponents";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import { FormattedMessage } from "react-intl";
import HeaderCard from "components/ui/Card/HeaderCard";

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
    <HeaderCard className="my-7" as="section">
      <HeaderCard.Header>
        <HeaderCard.HeaderText>
          <FormattedMessage id={title} />
        </HeaderCard.HeaderText>
      </HeaderCard.Header>
      <HeaderCard.Content>
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
      </HeaderCard.Content>
    </HeaderCard>
  );
};

export default LayersCard;
