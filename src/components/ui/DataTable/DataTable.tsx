import classNames from "classnames";
import ContextMenu, { IProps as IContextMenuProps } from "components/ui/ContextMenu/ContextMenu";
import { FormattedMessage } from "react-intl";
import React from "react";
import { Link } from "react-router-dom";

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
}

export interface IProps<T> {
  rows: T[];
  columnOrder: IColumnOrder<T>[];
  rowActions?: IRowAction<T>[];
  className?: string;
}

const DataTable = <T extends { [key: string]: string | number }>(props: IProps<T>) => {
  const { rows, columnOrder, className, rowActions } = props;

  return (
    <table className={classNames("c-data-table", className)}>
      <thead className="c-data-table__header">
        <tr>
          {columnOrder.map(column => (
            <th key={column.key.toString()}>
              <FormattedMessage id={column.name} />
            </th>
          ))}

          {rowActions && <th></th>}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, id) => (
          <tr key={id} className="c-data-table__row">
            {columnOrder.map(column => (
              <td key={column.key.toString()}>
                {column.rowHref ? (
                  <Link
                    className="u-link-unstyled"
                    to={typeof column.rowHref === "function" ? column.rowHref(row) : column.rowHref}
                  >
                    {row[column.key]}
                    <svg className="c-icon -x-small -green -no-margin">
                      <use xlinkHref="#icon-arrow-link"></use>
                    </svg>
                  </Link>
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
                  offsetY={5}
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
  );
};

export default DataTable;
