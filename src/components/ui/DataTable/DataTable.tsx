import classNames from "classnames";
import ContextMenu, { IProps as IContextMenuProps } from "components/ui/ContextMenu/ContextMenu";
import Pagination from "../Pagination/Pagination";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import SortIcon from "../SortIcon/SortIcon";

export interface IRowAction<T> extends Omit<Omit<IContextMenuProps["menuItems"][number], "onClick">, "href"> {
  onClick?: (row: T, value?: string) => void;
  // For dynamic links, set href as a function, this will pass the row and
  // value information each time to generate the link
  href?: string | ((row: T, value?: string) => string);
}

export interface IColumnOrder<T> {
  key: keyof T;
  name: string;
  rowHref?: string | ((row: T, value?: string) => string);
  rowLabel?: string | ((row: T, value?: string | number) => string);
  sortCompareFn?: (a: string | number, b: string | number, direction: Direction) => number;
}

export interface IProps<T> {
  rows: T[];
  isPaginated?: boolean;
  rowsPerPage?: number;
  columnOrder: IColumnOrder<T>[];
  rowActions?: IRowAction<T>[];
  className?: string;
}

export enum Direction {
  Asc = "ascending",
  Desc = "descending",
  None = "none"
}

const DataTable = <T extends { [key: string]: string | number }>(props: IProps<T>) => {
  const { rows, columnOrder, className, rowActions, isPaginated = false, rowsPerPage = 10 } = props;
  const [rowDisplayStart, setRowDisplayStart] = useState(0);
  const [sortedRows, setSortedRows] = useState<T[]>(rows);
  const [sortedCol, setSortedCol] = useState<IColumnOrder<T> | null>(null);
  const [sortedDirection, setSortedDirection] = useState<Direction>(Direction.None);

  useEffect(() => setRowDisplayStart(0), [rowsPerPage, rows]);

  const rowsToDisplay = isPaginated ? sortedRows.slice(rowDisplayStart, rowDisplayStart + rowsPerPage) : sortedRows;

  const handlePaginatedChange = useCallback(
    (pageNumber: number) => setRowDisplayStart(pageNumber === 1 ? 0 : (pageNumber - 1) * rowsPerPage),
    [rowsPerPage]
  );

  const handleSort = (col: IColumnOrder<T>) => {
    let direction = Direction.None;
    if (sortedCol === null) {
      direction = Direction.Asc;
    } else if (sortedCol.key === col.key && sortedRows && sortedDirection !== Direction.Desc) {
      direction = Direction.Desc;
    }

    if (direction !== Direction.None) {
      setSortedCol(col);
      setSortedDirection(direction);
    } else {
      setSortedCol(null);
      setSortedDirection(Direction.None);
    }
  };

  useEffect(() => {
    if (sortedCol !== null && sortedDirection !== Direction.None) {
      const newRows = [...rows];
      setSortedRows(
        newRows.sort((a, b) => sortedCol.sortCompareFn?.(a[sortedCol.key], b[sortedCol.key], sortedDirection) || 1)
      );
    } else {
      setSortedRows(rows);
    }
  }, [rows, sortedCol, sortedDirection]);

  return (
    <>
      <table className={classNames("c-data-table", className)}>
        <thead className="c-data-table__header">
          <tr>
            {columnOrder.map(column => (
              <th key={column.key.toString()} aria-sort={column.key === sortedCol?.key ? sortedDirection : undefined}>
                {column.sortCompareFn ? (
                  <button onClick={() => handleSort(column)} className="c-data-table__sort-button">
                    <FormattedMessage id={column.name} />
                    <SortIcon direction={column.key === sortedCol?.key ? sortedDirection : Direction.None} />
                  </button>
                ) : (
                  <FormattedMessage id={column.name} />
                )}
              </th>
            ))}

            {rowActions && <th></th>}
          </tr>
        </thead>

        <tbody>
          {rowsToDisplay.map((row, id) => (
            <tr key={id} className="c-data-table__row">
              {columnOrder.map(column => (
                <td key={column.key.toString()}>
                  {column.rowHref ? (
                    <Link
                      className="u-link-unstyled"
                      to={typeof column.rowHref === "function" ? column.rowHref(row) : column.rowHref}
                    >
                      {typeof column.rowLabel === "function" ? column.rowLabel(row, row[column.key]) : row[column.key]}
                    </Link>
                  ) : typeof column.rowLabel === "function" ? (
                    column.rowLabel(row, row[column.key])
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}

              {rowActions && (
                <td className="c-data-table__action-cell">
                  <ContextMenu
                    toggleClassName="c-data-table__action-toggle"
                    align="end"
                    offsetY={8}
                    menuItems={rowActions.map(({ onClick = () => {}, href, value, ...menuItem }) => ({
                      onClick: e => onClick(row, e.value),
                      href: typeof href === "function" ? href(row, value) : href,
                      value,
                      ...menuItem
                    }))}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length !== rowsToDisplay.length && (
        <div className="c-data-table__pagination">
          <Pagination min={1} max={Math.ceil(rows.length / rowsPerPage)} onPageChange={handlePaginatedChange} />
        </div>
      )}
    </>
  );
};

export default DataTable;
