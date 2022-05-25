import classNames from "classnames";
import Button from "components/ui/Button/Button";
import kebabIcon from "assets/images/icons/kebab.svg";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useCallback, useRef, useState } from "react";

interface IProps<T> {
  rows: T[];
  columnOrder: (keyof T)[];
  rowActions?: { name: string; callback: (row: T) => void }[];
  className?: string;
}

const DataTable = <T extends { [key: string]: string }>(props: IProps<T>) => {
  const { rows, columnOrder, className, rowActions } = props;
  const [activeContextMenu, setActiveContextMenu] = useState<number | undefined>(undefined);
  const rowEls = useRef<{ [key: number]: HTMLTableRowElement | null }>({});

  const openContextMenu = (rowId: number) => {
    setActiveContextMenu(rowId);
  };

  const closeContextMenu = useCallback(() => {
    setActiveContextMenu(undefined);
  }, [setActiveContextMenu]);

  return (
    <table className={classNames("c-data-table", className)}>
      <thead className="c-data-table__header">
        <tr>
          {columnOrder.map(column => (
            <th>{column.toString()}</th>
          ))}

          {rowActions && <th></th>}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowId) => {
          let rowPosition = undefined;
          if (rowEls.current[rowId]) {
            rowPosition = rowEls.current[rowId]!.getBoundingClientRect();
          }

          const contextMenuPosition = {
            x: rowPosition ? rowPosition.x + rowPosition.width : 0,
            y: rowPosition ? rowPosition.y + rowPosition.height : 0
          };

          return (
            <tr ref={element => (rowEls.current[rowId] = element)} className="c-data-table__row">
              {columnOrder.map(column => (
                <td>{row[column]}</td>
              ))}

              {rowActions && (
                <td>
                  <Button aria-label="Next" isIcon variant="primary" onClick={() => openContextMenu(rowId)}>
                    <img alt="" role="presentation" src={kebabIcon} />
                  </Button>

                  <ContextMenu
                    open={activeContextMenu === rowId}
                    position={contextMenuPosition}
                    onClose={closeContextMenu}
                    menuItems={rowActions.map(rowAction => ({
                      name: rowAction.name,
                      onClick: () => rowAction.callback(row)
                    }))}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
