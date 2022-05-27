import classNames from "classnames";
import ContextMenu, { IProps as IContextMenuProps } from "components/ui/ContextMenu/ContextMenu";
import { FormattedMessage } from "react-intl";
import React from "react";

export interface IProps<T> {
  rows: T[];
  columnOrder: { key: keyof T; name: string }[];
  rowActions?: (Omit<IContextMenuProps["menuItems"][number], "onClick"> & {
    onClick: (row: T, value?: string) => void;
  })[];
  className?: string;
}

const DataTable = <T extends { [key: string]: string }>(props: IProps<T>) => {
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
        {rows.map(row => (
          <tr key={row.name} className="c-data-table__row">
            {columnOrder.map(column => (
              <td key={column.key.toString()}>{row[column.key]}</td>
            ))}

            {rowActions && (
              <td className="c-data-table__action-cell">
                <ContextMenu
                  toggleClassName="c-data-table__action-toggle"
                  align="end"
                  offsetY={8}
                  menuItems={rowActions.map(({ onClick, ...menuItem }) => ({
                    onClick: e => onClick(row, e.value),
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
