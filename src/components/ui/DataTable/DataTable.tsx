import classNames from "classnames";
import Button from "components/ui/Button/Button";
import kebabIcon from "assets/images/icons/kebab.svg";

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
                <Button aria-label="Next" isIcon variant="primary">
                  <img alt="" role="presentation" src={kebabIcon} />
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
