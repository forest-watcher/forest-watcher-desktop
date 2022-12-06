import { differenceInMonths } from "date-fns";
import { FormatDateOptions, IntlShape } from "react-intl";

export const formatDate = (date: Date, type: "YYYY-MM-DD") => {
  switch (type) {
    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    default:
      date.toLocaleDateString();
  }
};

export const getDateStringsForComparison = (
  intl: IntlShape,
  dateBefore?: (Date | undefined)[],
  dateAfter?: (Date | undefined)[]
) => {
  if (!dateBefore || !dateAfter || !dateBefore[0] || !dateBefore[1] || !dateAfter[0] || !dateAfter[1]) {
    return;
  }

  const options: FormatDateOptions = { month: "long", year: "numeric" };

  const beforeDiff = differenceInMonths(dateBefore[1], dateBefore[0]);
  const afterDiff = differenceInMonths(dateAfter[1], dateAfter[0]);

  const beforeFromStr = intl.formatDate(dateBefore[0], options);
  const beforeToStr = intl.formatDate(dateBefore[1], options);
  const afterFromStr = intl.formatDate(dateAfter[0], options);
  const afterToStr = intl.formatDate(dateAfter[1], options);

  const beforeStr = beforeDiff === 1 ? beforeFromStr : `${beforeFromStr} - ${beforeToStr}`;
  const afterStr = afterDiff === 1 ? afterFromStr : `${afterFromStr} - ${afterToStr}`;

  return { beforeStr, afterStr };
};
