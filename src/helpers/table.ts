import { Direction } from "components/ui/DataTable/DataTable";

export const sortByDateString = (a: string | number, b: string | number, direction: Direction) => {
  const date1 = new Date(a).getTime();
  const date2 = new Date(b).getTime();

  if (direction === Direction.Asc) {
    return date1 - date2;
  }

  return date2 - date1;
};

export const sortByString = (a: string | number, b: string | number, direction: Direction) => {
  if (direction === Direction.Asc) {
    return a.toString().localeCompare(b.toString());
  }

  return b.toString().localeCompare(a.toString());
};
