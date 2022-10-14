import { Fragment } from "react";

type ListProps<T> = {
  items: T[];
  render: (item: T, index: number) => JSX.Element | null;
  loading?: boolean;
  className?: string;
};

const List = <T extends Record<any, any>>({ items, render, className }: ListProps<T>) => {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <Fragment key={i}>{render(item, i)}</Fragment>
      ))}
    </div>
  );
};

export default List;
