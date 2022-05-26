import classNames from "classnames";
import Button from "components/ui/Button/Button";
import kebabIcon from "assets/images/icons/kebab.svg";
import { Menu as ContextMenu, MenuItem, MenuButton } from "@szhsin/react-menu";

interface IProps<T> {
  rows: T[];
  columnOrder: (keyof T)[];
  rowActions?: { name: string; callback: (row: T) => void }[];
  className?: string;
}

const DataTable = <T extends { [key: string]: string }>(props: IProps<T>) => {
  const { rows, columnOrder, className, rowActions } = props;

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
        {rows.map(row => (
          <tr className="c-data-table__row">
            {columnOrder.map(column => (
              <td>{row[column]}</td>
            ))}

            {rowActions && (
              <td>
                <ContextMenu
                  menuClassName="c-context-menu"
                  portal={true}
                  menuButton={
                    <MenuButton>
                      <Button aria-label="Next" isIcon variant="primary">
                        <img alt="" role="presentation" src={kebabIcon} />
                      </Button>
                    </MenuButton>
                  }
                  transition
                  align="end"
                  offsetY={12}
                >
                  {rowActions.map(rowAction => (
                    <MenuItem className="c-context-menu__item" onClick={() => rowAction.callback(row)}>
                      {rowAction.name}
                    </MenuItem>
                  ))}
                </ContextMenu>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
