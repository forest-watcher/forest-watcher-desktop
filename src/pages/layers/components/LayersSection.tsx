import LayersCard from "./LayersCard";
import LayersSectionHeader from "./LayersSectionHeader";
import { Layers } from "generated/clayers/clayersResponses";
import OptionalWrapper from "components/extensive/OptionalWrapper";

export interface ILayersSection {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardItems: Layers["data"];
  className?: string;
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
  layersLoading
}: ILayersSectionProps) => {
  return (
    <OptionalWrapper data={cardItems.length > 0} elseComponent={<></>}>
      <section className={className}>
        <div className="l-content">
          <div className="row">
            <div className="column">
              <LayersSectionHeader title={title} subtitle={subtitle} />
              <LayersCard
                title={cardTitle}
                items={cardItems}
                refetchLayers={refetchLayers}
                layersLoading={layersLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </OptionalWrapper>
  );
};

export default LayersSection;
