import classNames from "classnames";
import ContextMenu, { IProps as IContextMenuProps } from "components/ui/ContextMenu/ContextMenu";
import Pagination from "../Pagination/Pagination";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import SortIcon from "components/ui/SortIcon/SortIcon";
import get from "lodash.get";
import CheckboxOnIcon from "assets/images/icons/checkbox-on.svg";
import CheckboxOnffIcon from "assets/images/icons/checkbox-off.svg";

export interface IRowAction<T> extends Omit<Omit<IContextMenuProps["menuItems"][number], "onClick">, "href"> {
  onClick?: (row: T, value?: string) => void;
  // For dynamic links, set href as a function, this will pass the row and
  // value information each time to generate the link
  href?: string | ((row: T, value?: string) => string);
  shouldShow?: (row: T, value?: string) => boolean;
}

export interface IColumnOrder<T> {
  key: keyof T;
  name?: string;
  rowHref?: string | ((row: T, value?: string) => string);
  rowLabel?: string | ((row: T, value?: string | number | any[]) => string);
  sortCompareFn?: (a: string | number | any[], b: string | number | any[], direction: Direction) => number;
  rowHrefClassNames?: string;
  rowCellClassNames?: string;
}

export interface IProps<T> {
  rows: T[];
  isPaginated?: boolean;
  rowsPerPage?: number;
  columnOrder: IColumnOrder<T>[];
  rowActions?: IRowAction<T>[];
  className?: string;
  onSelect?: (selected: T[]) => void;
  selectFindGetter?: string;
}

export enum Direction {
  Asc = "ascending",
  Desc = "descending",
  None = "none"
}

interface ICheckBoxParams {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  checked: boolean;
}

const CellCheckbox: FC<ICheckBoxParams> = ({ label, checked, ...rest }) => {
  return (
    <div>
      <label className="u-flex c-data-table__checkbox">
        <span className="u-visually-hidden">{label}</span>
        <img
          role="presentation"
          alt=""
          src={CheckboxOnffIcon}
          className={classNames(checked && "u-visually-hidden")}
          width="24"
          height="24"
        />
        <img
          role="presentation"
          alt=""
          src={CheckboxOnIcon}
          className={classNames(!checked && "u-visually-hidden")}
          width="24"
          height="24"
        />
        <input className="u-visually-hidden" {...rest} type="checkbox" checked={checked} />
      </label>
    </div>
  );
};

const DataTable = <T extends { [key: string]: string | number | any[] }>(props: IProps<T>) => {
  const {
    rows,
    columnOrder,
    className,
    rowActions,
    isPaginated = false,
    rowsPerPage = 10,
    onSelect,
    selectFindGetter = "id"
  } = props;
  const [rowDisplayStart, setRowDisplayStart] = useState(0);
  const [sortedRows, setSortedRows] = useState<T[]>(rows);
  const [sortedCol, setSortedCol] = useState<IColumnOrder<T> | null>(null);
  const [sortedDirection, setSortedDirection] = useState<Direction>(Direction.None);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const intl = useIntl();

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

  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows);
    }
  };

  const handleSelectOne = (row: T) => {
    const index = selectedRows.findIndex(selected => get(selected, selectFindGetter) === get(row, selectFindGetter));
    if (index > -1) {
      setSelectedRows(rows => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        return newRows;
      });
    } else {
      setSelectedRows(rows => {
        const newRows = [...rows];
        newRows.push(row);
        return newRows;
      });
    }
  };

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedRows);
    }
  }, [selectedRows, onSelect]);

  return (
    <>
      <div className="u-responsive-table">
        <table className={classNames("c-data-table", className)}>
          <thead className="c-data-table__header">
            <tr>
              {onSelect && (
                <th className="c-data-table__checkbox-cell c-data-table__checkbox-header-cell">
                  <CellCheckbox
                    label={intl.formatMessage({ id: "common.selectAll" })}
                    onChange={handleSelectAll}
                    checked={selectedRows.length === rows.length}
                  />
                </th>
              )}
              {columnOrder.map(column => (
                <th key={column.key.toString()} aria-sort={column.key === sortedCol?.key ? sortedDirection : undefined}>
                  {column.sortCompareFn ? (
                    <button onClick={() => handleSort(column)} className="c-data-table__sort-button">
                      {column.name && <FormattedMessage id={column.name} />}
                      <SortIcon direction={column.key === sortedCol?.key ? sortedDirection : Direction.None} />
                    </button>
                  ) : (
                    column.name && <FormattedMessage id={column.name} />
                  )}
                </th>
              ))}

              {rowActions && <th></th>}
            </tr>
          </thead>

          <tbody>
            {rowsToDisplay.map((row, id) => (
              <tr key={id} className="c-data-table__row">
                {onSelect && (
                  <td className="c-data-table__checkbox-cell">
                    <CellCheckbox
                      label={intl.formatMessage({ id: "common.selectRow" })}
                      onChange={() => handleSelectOne(row)}
                      checked={
                        selectedRows.findIndex(
                          selected => get(selected, selectFindGetter) === get(row, selectFindGetter)
                        ) > -1
                      }
                    />
                  </td>
                )}
                {columnOrder.map(column => (
                  <td key={column.key.toString()} className={column.rowCellClassNames}>
                    {column.rowHref ? (
                      <Link
                        className={`u-link-unstyled ${column.rowHrefClassNames}`}
                        to={typeof column.rowHref === "function" ? column.rowHref(row) : column.rowHref}
                      >
                        {typeof column.rowLabel === "function"
                          ? column.rowLabel(row, row[column.key])
                          : row[column.key]}
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
                      menuItems={rowActions
                        .filter(rowAction => (rowAction.shouldShow ? rowAction.shouldShow(row, rowAction.value) : true))
                        .map(({ onClick = () => {}, href, value, shouldShow, ...menuItem }) => ({
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
      </div>
      {rows.length !== rowsToDisplay.length && (
        <div className="c-data-table__pagination">
          <Pagination min={1} max={Math.ceil(rows.length / rowsPerPage)} onPageChange={handlePaginatedChange} />
        </div>
      )}
    </>
  );
};

export default DataTable;
