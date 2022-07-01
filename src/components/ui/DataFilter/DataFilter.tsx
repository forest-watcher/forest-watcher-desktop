import classnames from "classnames";
import { useForm, useWatch } from "react-hook-form";
import FormModalInput from "components/modals/FormModalInput";
import { TAvailableTypes } from "components/modals/FormModal";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

export interface IFilter<T, OPTION_TYPE> {
  name: string;
  filterOptions: T;
  filterCallback: (item: OPTION_TYPE, value: any) => boolean;
}

export interface IProps<T, OPTION_TYPE> {
  filters: IFilter<TAvailableTypes<T>, OPTION_TYPE>[];
  className?: string;
  options: OPTION_TYPE[];
  onFiltered?: (arr: OPTION_TYPE[]) => void;
}

const DataFilter = <T, OPTION_TYPE>(props: IProps<T, OPTION_TYPE>) => {
  const { filters, className, options, onFiltered } = props;

  const formhook = useForm<T>();
  const watcher = useWatch({ control: formhook.control });

  useEffect(() => {
    const keys = Object.keys(watcher);
    let filtered = [...options];

    keys.forEach(key => {
      const filter = filters.find(item => item.filterOptions.registerProps.name === key);
      filtered = filtered.filter(item => filter?.filterCallback(item, watcher[key as keyof typeof watcher]));
    });

    onFiltered?.(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watcher]);

  return (
    <>
      <form className={classnames(className, "c-data-filter")}>
        <p className="c-data-filter__label">
          <FormattedMessage id="filters.title" />
        </p>
        <div className="c-data-filter__filters">
          {filters.map(item => (
            <FormModalInput<T> key={item.filterOptions.id} input={item.filterOptions} formhook={formhook} />
          ))}
        </div>
      </form>
    </>
  );
};

export default DataFilter;
