import { Popover } from "@headlessui/react";
import Icon from "components/extensive/Icon";
import { fireGAEvent } from "helpers/analytics";
import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { MapActions, MapLabel } from "types/analytics";

export interface IProps {}

const MAP_KEYS = [
  {
    icon: "mapKeyIcons/Alerts",
    label: "maps.legend.key.alerts"
  },
  {
    icon: "mapKeyIcons/MyReports",
    label: "maps.legend.key.my.reports"
  },
  {
    icon: "mapKeyIcons/ImportedReports",
    label: "maps.legend.key.imported.reports"
  },
  {
    icon: "mapKeyIcons/VIIRSAlerts",
    label: "maps.legend.key.VIIRS.alerts"
  },
  {
    icon: "mapKeyIcons/VIIRSReports",
    label: "maps.legend.key.VIIRS.reports"
  },
  {
    icon: "mapKeyIcons/AssignmentsCreated",
    label: "maps.legend.key.assignments.created"
  },
  {
    icon: "mapKeyIcons/AssignmentsAssigned",
    label: "maps.legend.key.assignments.assigned"
  }
];

const MapLegendControl: FC<IProps> = () => {
  return (
    <Popover className="c-map__search-controls">
      <Popover.Button
        className="rounded-md border-2 border-solid border-neutral-400 bg-neutral-300 inline-flex items-center text-neutral-700 text-lg h-[41px] font-fira hover:bg-neutral-400"
        onClick={() => {
          fireGAEvent({
            category: "Map",
            action: MapActions.Legend,
            label: MapLabel.ViewedLegend
          });
        }}
      >
        <Icon className="mx-2" name="MapKey" />
        <span className="mr-3.5">
          <FormattedMessage id="maps.legend.title" />
        </span>
      </Popover.Button>

      {/*Key Legend*/}
      <Popover.Panel className="c-map-legend flex flex-col rounded-md bg-neutral-300 border-2 w-[350px] h-[330px] absolute top-0 right-0 border-neutral-400 border-solid">
        {({ close }) => (
          <>
            {/*Key Header*/}
            <div className="border-solid border-b-2 p-5 flex items-center border-neutral-400">
              <Icon className="mr-3" name="MapKey" size={32} />
              <span className="text-neutral-700 text-lg font-fira">
                <FormattedMessage id="maps.legend.title" />
              </span>
              <button
                aria-label="Close"
                className="rounded-md border-solid border-2 border-neutral-400 w-10 h-10 inline-flex items-center justify-center ml-auto hover:bg-neutral-400"
                onClick={() => close()}
              >
                <Icon name="Close" size={25} />
              </button>
            </div>

            {/*Key List*/}
            <div className="p-5 pr-2 overflow-auto">
              <div className="flex flex-col gap-y-4">
                {MAP_KEYS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center">
                    <Icon className="mr-[0.688rem]" name={icon} />
                    <span className="text-neutral-600 font-fira text-base">
                      <FormattedMessage id={label} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
};

export default MapLegendControl;
