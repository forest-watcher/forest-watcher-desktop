import classNames from "classnames";
import ContextMenu, { IProps as IContextMenuProps } from "components/ui/ContextMenu/ContextMenu";

export interface IProps<T> {
  rows: T[];
  columnOrder: (keyof T)[];
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
          {columnOrder.map((column, id) => (
            <th key={id}>{column.toString()}</th>
          ))}

          {rowActions && <th></th>}
        </tr>
      </thead>

      <tbody>
        {rows.map(row => (
          <tr key={row.name} className="c-data-table__row">
            {columnOrder.map((column, id) => (
              <td key={id}>{row[column]}</td>
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
