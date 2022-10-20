type ListProps<T> = {
  items: T[];
  render: (item: T, index: number) => JSX.Element | null;
  loading?: boolean;
  className?: string;
};

const List = <T extends Record<any, any>>({ items, render, className }: ListProps<T>) => {
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={i}>{render(item, i)}</li>
      ))}
    </ul>
  );
};

export default List;
