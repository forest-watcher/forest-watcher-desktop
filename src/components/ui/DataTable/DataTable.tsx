import classNames from "classnames";

interface IProps<T> {
  rows: T[];
  columnOrder: (keyof T)[];
  rowActions?: [{ name: string; callback: (row: T) => void }];
  className: string;
}

const DataTable = <T extends { [key: string]: string }>(props: IProps<T>) => {
  const { rows, columnOrder, className } = props;

  return (
    <table className={classNames("c-data-table", className)}>
      <thead className="c-data-table__header">
        <tr>
          {columnOrder.map(column => (
            <th>{column.toString()}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(row => (
          <tr className="c-data-table__row">
            {columnOrder.map(column => (
              <td>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
