import { UseMutateAsyncFunction } from "@tanstack/react-query";
import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { PatchContextualLayerError, PatchContextualLayerVariables } from "generated/clayers/clayersComponents";
import { Layer } from "generated/clayers/clayersResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { FormattedMessage } from "react-intl";

type LayersSectionItemProps = {
  item: Layer["data"];
  isLast: boolean;
  refetchLayers: () => void;
  updateLayer: UseMutateAsyncFunction<Layer, PatchContextualLayerError, PatchContextualLayerVariables, unknown>;
};

const LayersCardItem = ({ item, isLast, refetchLayers, updateLayer }: LayersSectionItemProps) => {
  const { httpAuthHeader } = useAccessToken();

  const handleLayerUpdate = async () => {
    return updateLayer(
      {
        headers: httpAuthHeader,
        pathParams: { layerId: item.id },
        body: { name: item.attributes.name, url: item.attributes.url, enabled: !item.attributes.enabled }
      },
      { onSuccess: () => refetchLayers() }
    );
  };

  return (
    <div className={`flex gap-4 items-center ${isLast ? "" : " mb-6"}`}>
      <OptionalWrapper data={!item.attributes.isPublic}>
        <button
          onClick={handleLayerUpdate}
          className={`border-[1.75px] border-solid rounded-full w-7 h-7 flex items-center justify-center ${
            item.attributes.enabled ? "border-green-500" : "border-neutral-500"
          }`}
        >
          <OptionalWrapper data={item.attributes.enabled}>
            <Icon name="check" size={12} className="text-green-500  " />
          </OptionalWrapper>
        </button>
      </OptionalWrapper>
      <p className="text-neutral-700 uppercase text-sm font-[500]">
        <FormattedMessage id={`${item.attributes.name}`} />
      </p>
    </div>
  );
};

export default LayersCardItem;
