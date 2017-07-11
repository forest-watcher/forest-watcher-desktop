// filter data by a field and its desired value
const filterBy = (data, field, value) => {
  // debugger
  if (field === 'search') {
    return data.filter((item) => {
        return Object.keys(item).some((key) => {
            debugger
            if (item[key] !== null) {
              if(item[key].toLowerCase().includes(value.toLowerCase())) return true;
            }
            return false;
        })
    });
  } else {
    return data.filter((item) => item[field] === value);
  }
}

const filterData = (data, searchParams) => {
  const { aoi, date, searchValues } = searchParams;
  if (aoi !== undefined){ 
    data = filterBy(data, 'aoi', aoi);
  }
  if (searchValues !== undefined){ 
    data = filterBy(data, 'search', searchValues);
  }
  if (date !== undefined){ 
    data = filterBy(data, 'date', date);
  }
  return data;
}

const getDataAreas = (data, areas) => {
  const areasIndex = [];
  const areasOptions = [];
  data.forEach((answer) => {
    if (areas.ids.indexOf(answer.aoi) > -1 && areasIndex.indexOf(answer.aoi) === -1) {
      areasIndex.push(answer.aoi);
      areasOptions.push({ label: areas.data[answer.aoi] && areas.data[answer.aoi].attributes.name, value: answer.aoi });
    }
  });
  return areasOptions;
}

export { filterData, getDataAreas };