import { useCallback, useState } from "react";

type ListProps<T> = {
  items: T[];
  render: (item: T, index: number) => JSX.Element | null;
  loading?: boolean;
  className?: string;
  itemClassName?: string;
  autoScrollToBottom?: boolean;
};

const List = <T extends Record<any, any>>({
  items = [],
  render,
  className,
  itemClassName,
  autoScrollToBottom = false
}: ListProps<T>) => {
  const [lengthOfRenderedItems, setLengthOfRenderedItems] = useState(items.length);

  const handleRefChange = useCallback(
    (e: HTMLUListElement) => {
      if (e?.children.length > lengthOfRenderedItems && autoScrollToBottom) {
        window.scrollTo({ top: e.offsetHeight });
      }

      setLengthOfRenderedItems(items.length);
    },
    [autoScrollToBottom, items.length, lengthOfRenderedItems]
  );

  return (
    <ul ref={handleRefChange} className={className}>
      {items?.map?.((item, i) => (
        <li key={i} className={itemClassName}>
          {render(item, i)}
        </li>
      ))}
    </ul>
  );
};

export default List;
