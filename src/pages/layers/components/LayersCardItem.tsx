import Icon from "components/extensive/Icon";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { Layer } from "generated/clayers/clayersResponses";
import { FormattedMessage } from "react-intl";

type LayersSectionItemProps = {
  item: Layer["data"];
  isLast: boolean;
};

const LayersCardItem = ({ item, isLast }: LayersSectionItemProps) => {
  return (
    <div className={`flex gap-4 items-center ${isLast ? "" : " mb-6"}`}>
      <OptionalWrapper data={!item.attributes.isPublic}>
        <div
          className={`border-[1.75px] border-solid rounded-full w-7 h-7 flex items-center justify-center ${
            item.attributes.enabled ? "border-green-500" : "border-gray-500"
          }`}
        >
          <OptionalWrapper data={item.attributes.enabled}>
            <Icon name="check" size={12} className="text-green-500" />
          </OptionalWrapper>
        </div>
      </OptionalWrapper>
      <p className="text-gray-700 uppercase text-sm font-[500]">
        <FormattedMessage id={`${item.attributes.name}`} />
      </p>
    </div>
  );
};

export default LayersCardItem;
