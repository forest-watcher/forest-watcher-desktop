// filter data by a field and its desired value
const filterBy = (data, field, value) => {
  if (field === 'search') {
    return data.filter((item) => {
        return Object.keys(item).some((key) => {
            if(item[key].toLowerCase().includes(value.toLowerCase())) return true;
            return false;
        })
    });
  } else {
    return data.filter((item) => item.date === value);
  }
}

export { filterBy };