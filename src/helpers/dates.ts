export const formatDate = (date: Date, type: "YYYY-MM-DD") => {
  switch (type) {
    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    default:
      date.toLocaleDateString();
  }
};
