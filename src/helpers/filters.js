// filter data by a field and its desired value
import moment from "moment";
import { DEFAULT_FORMAT } from "constants/global";

const filterBy = (data, field, value) => {
  if (field === "search") {
    return data.filter(item => {
      return Object.keys(item).some(key => {
        if (item[key] !== null) {
          if (item[key].toLowerCase().includes(value.toLowerCase())) return true;
        }
        return false;
      });
    });
  } else if (Array.isArray(value)) {
    return data.filter(item => value.indexOf(item[field]) > -1);
  } else if (field === "date") {
    return data.filter(item => {
      const itemDate = moment(item[field]);

      // dayOfYear: 1 to 366
      // year: xxxx
      return itemDate.dayOfYear() === value.dayOfYear() && itemDate.year() === value.year();
    });
  } else {
    return data.filter(item => item[field] === value);
  }
};

const filterData = (data, searchParams) => {
  const { aoi, date, searchValues } = searchParams;
  if (aoi !== undefined) {
    data = filterBy(data, "aoi", aoi);
  }
  if (searchValues !== undefined) {
    data = filterBy(data, "search", searchValues);
  }
  if (date !== undefined) {
    data = filterBy(data, "date", moment(date, DEFAULT_FORMAT));
  }
  return data;
};

const getSelectorValueFromArray = (value, data) => {
  const selected = data.filter(obj => {
    return obj.option === value;
  });
  selected[0].value = selected[0].option;
  return selected[0];
};

const getDataAreas = (data, areas) => {
  const areasIndex = [];
  const areasOptions = [];
  data.forEach(answer => {
    if (areas.ids.indexOf(answer.aoi) > -1 && areasIndex.indexOf(answer.aoi) === -1) {
      areasIndex.push(answer.aoi);
      areasOptions.push({ label: areas.data[answer.aoi] && areas.data[answer.aoi].attributes.name, value: answer.aoi });
    }
  });
  return areasOptions;
};

export { filterData, getDataAreas, getSelectorValueFromArray, filterBy };
