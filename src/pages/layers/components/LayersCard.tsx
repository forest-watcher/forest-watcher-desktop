import List from "components/extensive/List";
import LayersCardItem from "./LayersCardItem";
import { Layers } from "generated/clayers/clayersResponses";

type LayersCardProps = {
  title: string;
  items: Layers["data"];
};

const LayersCard = ({ title, items }: LayersCardProps) => {
  return (
    <section className="my-7">
      {/* Title */}
      <div className="bg-green-400 border-2 border-solid border-green-500 py-7 px-6 rounded-t-[4px] border-opacity-20">
        <p className="text-[24px] text-gray-700 font-[400]">{title}</p>
      </div>
      {/* Content */}
      <div className="bg-gray-300 py-7 px-6 border-2 border-solid border-gray-500 border-opacity-40 rounded-b-[4px]">
        <List
          items={items}
          // @ts-expect-error
          render={(item, index) => <LayersCardItem item={item} isLast={index === items.length - 1} />}
        />
      </div>
    </section>
  );
};

export default LayersCard;
