import { Direction } from "components/ui/DataTable/DataTable";
import { IntlShape } from "react-intl";
import { Option } from "types/select";
import moment from "moment";

export const ALL_VALUE = "all";

export enum TimeFrames {
  twoWeeks = moment().subtract(2, "weeks").valueOf(),
  oneMonth = moment().subtract(1, "month").valueOf(),
  twoMonths = moment().subtract(2, "months").valueOf(),
  sixMonths = moment().subtract(6, "months").valueOf(),
  oneYear = moment().subtract(1, "year").valueOf()
}

export const getTimeFrames = (intl: IntlShape): Option[] => [
  { label: intl.formatMessage({ id: "common.all" }), value: ALL_VALUE },
  { label: intl.formatMessage({ id: "timeframes.2weeks" }), value: TimeFrames.twoWeeks },
  { label: intl.formatMessage({ id: "timeframes.1month" }), value: TimeFrames.oneMonth },
  { label: intl.formatMessage({ id: "timeframes.2months" }), value: TimeFrames.twoMonths },
  { label: intl.formatMessage({ id: "timeframes.6months" }), value: TimeFrames.sixMonths },
  { label: intl.formatMessage({ id: "timeframes.12months" }), value: TimeFrames.oneYear }
];

export const filterByTimeFrame = (item: any, value: any) => {
  if (!value || value === ALL_VALUE) {
    return true;
  } else {
    const start = new Date(value);
    const end = new Date();
    const compare = new Date(item);
    return compare > start && compare < end;
  }
};

export const sortByDateString = (a: string | number | any[], b: string | number | any[], direction: Direction) => {
  if (Array.isArray(a) || Array.isArray(b)) {
    return 0;
  }
  const date1 = new Date(a).getTime();
  const date2 = new Date(b).getTime();

  if (direction === Direction.Asc) {
    return date1 - date2;
  }

  return date2 - date1;
};

export const sortByString = (a: string | number | any[], b: string | number | any[], direction: Direction) => {
  if (direction === Direction.Asc) {
    return a.toString().localeCompare(b.toString());
  }

  return b.toString().localeCompare(a.toString());
};
