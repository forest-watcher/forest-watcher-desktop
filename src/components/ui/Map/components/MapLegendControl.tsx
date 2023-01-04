import Icon from "components/extensive/Icon";
import { FC } from "react";
import { Popover } from "@headlessui/react";

export interface IProps {}

const MapLegendControl: FC<IProps> = props => {
  // const {} = props;

  return (
    <Popover className="c-map__search-controls">
      <Popover.Button className="rounded-md border-2 border-solid border-neutral-400 bg-neutral-300 inline-flex items-center text-neutral-700 text-lg h-[41px] font-fira hover:bg-neutral-400">
        <Icon className="mx-2" name="MapKey" />
        <span className="mr-3.5">Map Legend</span>
      </Popover.Button>

      {/*Key Legend*/}
      <Popover.Panel className="c-map-legend rounded-md bg-neutral-300 border-2 w-[350px] h-[330px] absolute top-0 right-0 border-neutral-400 border-solid">
        {({ close }) => (
          <>
            {/*Key Header*/}
            <div className="border-solid border-b-2 p-5 flex items-center border-neutral-400">
              <Icon className="mr-3" name="MapKey" size={32} />
              <span className="text-neutral-700 text-lg font-fira">Map Legend</span>
              <button
                aria-label="Close"
                className="rounded-md border-solid border-2 border-neutral-400 w-10 h-10 inline-flex items-center justify-center ml-auto hover:bg-neutral-400"
                onClick={() => close()}
              >
                <Icon name="Close" size={25} />
              </button>
            </div>

            {/*Key List*/}
            <div className="p-5 pr-2" style={{ color: "red" }}>
              <div className="overflow-auto">Hello OE</div>
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default MapLegendControl;
