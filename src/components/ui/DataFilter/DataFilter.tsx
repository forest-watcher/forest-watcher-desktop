import classnames from "classnames";
import { DeepPartial, UnpackNestedValue, useForm, useWatch } from "react-hook-form";
import FormModalInput from "components/modals/FormModalInput";
import FormModal, { TAvailableTypes } from "components/modals/FormModal";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface IFilter<T, OPTION_TYPE> {
  name: string;
  filterOptions: T;
  filterCallback: (item: OPTION_TYPE, value: any) => boolean;
  getShouldShow?: () => boolean;
}

export interface IProps<T, OPTION_TYPE> {
  filters: IFilter<TAvailableTypes<T>, OPTION_TYPE>[];
  extraFilters?: IFilter<TAvailableTypes<T>, OPTION_TYPE>[];
  className?: string;
  options: OPTION_TYPE[];
  onFiltered?: (arr: OPTION_TYPE[]) => void;
  defaults?: UnpackNestedValue<DeepPartial<T>>;
  children?: React.ReactNode;
}

const DataFilter = <T, OPTION_TYPE>(props: IProps<T, OPTION_TYPE>) => {
  const { filters, className, options, onFiltered, extraFilters, defaults, children } = props;

  const formhook = useForm<T>({
    defaultValues: defaults
  });
  const watcher = useWatch({ control: formhook.control });
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  const [extrasValue, setExtrasValue] = useState<undefined | UnpackNestedValue<T>>(undefined);

  const shouldShowExtraFilters = useMemo(() => {
    const findAtleastOne = extraFilters?.find(item => (item.getShouldShow ? item.getShouldShow() : true));
    return Boolean(findAtleastOne);
  }, [extraFilters]);

  useEffect(() => {
    const keys = [...Object.keys(watcher), ...(extrasValue ? Object.keys(extrasValue) : [])];
    let filtered = [...options];
    let values = watcher;

    if (extrasValue) {
      values = { ...watcher, ...extrasValue };
    }

    keys.forEach(key => {
      const filter = [...filters, ...(extraFilters ? extraFilters : [])].find(
        //@ts-ignore
        item => item.filterOptions.registerProps.name === key
      );
      filtered = filtered.filter(item => filter?.filterCallback(item, values[key as keyof typeof values]));
    });

    onFiltered?.(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watcher, extrasValue]);

  const onExtrasSubmit = (resp: UnpackNestedValue<T>) => {
    setIsExtrasOpen(false);
    setExtrasValue(resp);
    return Promise.resolve();
  };

  return (
    <>
      <form className={classnames(className, "c-data-filter")}>
        <p className="c-data-filter__label">
          <FormattedMessage id="filters.title" />
        </p>
        <div className="c-data-filter__filters">
          {filters.map(
            item =>
              (item.getShouldShow ? item.getShouldShow() : true) && (
                <FormModalInput<T> key={item.filterOptions.id} input={item.filterOptions} formhook={formhook} />
              )
          )}
        </div>
        {extraFilters && shouldShowExtraFilters && (
          <button
            onClick={e => {
              e.preventDefault();
              setIsExtrasOpen(true);
            }}
            className="c-link c-data-filter__add-more"
          >
            <FormattedMessage id="filters.extra" />
          </button>
        )}
        {children ? children : <></>}
      </form>
      <FormModal<T>
        isOpen={isExtrasOpen}
        onClose={() => {
          setExtrasValue(undefined);
          setIsExtrasOpen(false);
        }}
        onSave={onExtrasSubmit}
        modalTitle="filters.extra"
        submitBtnName="common.done"
        cancelBtnName="filters.clearAll"
        inputs={extraFilters?.map(filter => filter.filterOptions) || []}
        resetValues={extrasValue}
      />
    </>
  );
};

export default DataFilter;
