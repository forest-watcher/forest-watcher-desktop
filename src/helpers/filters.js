// filter data by a field and its desired value
const filterBy = (data, field, value) => {
  // debugger
  if (field === 'search') {
    return data.filter((item) => {
        return Object.keys(item).some((key) => {
            if(item[key].toLowerCase().includes(value.toLowerCase())) return true;
            return false;
        })
    });
  } else {
    return data.filter((item) => item[field] === value);
  }
}

export { filterBy };