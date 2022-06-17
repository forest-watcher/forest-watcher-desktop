import classnames from "classnames";
import { Fragment, useCallback, useEffect, useState } from "react";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { SelectProps, Option } from "types/select";
import errorIcon from "assets/images/icons/Error.svg";
import { FieldError } from "./FieldError";
import { Listbox } from "@headlessui/react";
import RadioOff from "assets/images/icons/RadioOff.svg";
import RadioOn from "assets/images/icons/RadioOn.svg";

export interface Props extends FieldPropsBase {
  selectProps: SelectProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: () => void;
  isSimple?: boolean;
  isMultiple?: boolean;
}

const getSelectedItems = (isMultiple: boolean, value: any, options: Option[]) => {
  if (!isMultiple) {
    return value ? options.find(opt => opt.value === value) : null;
  }

  return options.filter(opt => value.find((item: string) => item === opt.value));
};

const Select = (props: Props) => {
  const { selectProps, registered, error, id, formHook, isSimple = false, hideLabel, isMultiple = false } = props;
  const [options, setOptions] = useState<Option[]>(selectProps.options || []);

  const value =
    formHook.watch(props.registered.name) ||
    (Array.isArray(selectProps.defaultValue)
      ? selectProps.defaultValue.map(item => item.value)
      : selectProps.defaultValue?.value);

  const selectedItems = getSelectedItems(isMultiple, value, options);

  const label = isMultiple
    ? options
        .filter(opt => value.find((item: string) => item === opt.value))
        .map(item => item.label)
        .join(", ")
    : value
    ? options.find(opt => opt.value === value)?.label
    : null;

  const fetchOptions = useCallback(async () => {
    if (!!selectProps.asyncFetchOptions) {
      setOptions(await selectProps.asyncFetchOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProps.asyncFetchOptions]);

  const onChange = (v: any) => {
    if (isMultiple) {
      props.formHook.setValue(
        registered.name,
        v.map((item: Option) => item.value)
      );
    } else if (v.value) {
      props.formHook.setValue(registered.name, v?.value);
    }
    props.formHook.clearErrors(registered.name);
    if (props.onChange) {
      props.onChange();
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return (
    <div className={classnames("c-input", selectProps.alternateLabelStyle && "c-input--alt-label")}>
      <Listbox value={selectedItems} onChange={onChange} multiple={isMultiple}>
        {({ open }) => (
          <>
            {selectProps.label && (
              <Listbox.Label
                className={classnames(
                  "c-input__label c-input__label--select",
                  selectProps.alternateLabelStyle && "c-input__label--alt",
                  (isSimple || hideLabel) && "u-visually-hidden"
                )}
              >
                {selectProps.label}
              </Listbox.Label>
            )}
            <div className="u-w-100">
              <div
                className={classnames(
                  "c-input__select",
                  open && "c-input__select--open",
                  isSimple && "c-input__select--simple",
                  isMultiple && "c-input__select--multiple"
                )}
              >
                <Listbox.Button
                  className={classnames(
                    "c-input__select-button",
                    !value && "c-input__select-button--has-placeholder",
                    open && "c-input__select-button--open",
                    error && "c-input__select-button--invalid",
                    isSimple && "c-input__select-button--simple",
                    isMultiple && "u-visually-hidden"
                  )}
                >
                  <span className="c-input__select-value">{label ? label : selectProps.placeholder}</span>
                  {error ? (
                    <img alt="" role="presentation" src={errorIcon} className="c-input__select-error-icon" />
                  ) : isSimple ? (
                    <svg
                      width="10"
                      height="11"
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={classnames("c-input__select-indicator", open && "c-input__select-indicator--rotate")}
                    >
                      <g clipPath="url(#clip0_564_444)">
                        <path
                          d="M9.90031 3.05438L9.39937 2.55344C9.3325 2.48656 9.25562 2.45312 9.16875 2.45312C9.08187 2.45312 9.00531 2.48656 8.93844 2.55344L5.00031 6.49125L1.0625 2.55344C0.995625 2.48656 0.91875 2.45312 0.831875 2.45312C0.745 2.45312 0.668125 2.48656 0.60125 2.55344L0.100312 3.05438C0.0334375 3.12125 0 3.19813 0 3.285C0 3.37187 0.0334375 3.44875 0.100312 3.51531L4.76969 8.18469C4.83656 8.25156 4.91344 8.285 5.00031 8.285C5.08719 8.285 5.16375 8.25156 5.23062 8.18469L9.90031 3.51531C9.96719 3.44844 10.0003 3.37156 10.0003 3.285C10.0003 3.19844 9.96719 3.12125 9.90031 3.05438Z"
                          fill="#555555"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_564_444">
                          <rect width="10" height="10" fill="white" transform="translate(0 0.369141)" />
                        </clipPath>
                      </defs>
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className={classnames("c-input__select-indicator", open && "c-input__select-indicator--rotate")}
                    >
                      <path
                        d="M8.49984 9.84808L13.3364 4.75146L14.8332 6.07662L8.49984 12.7515L2.1665 6.07662L3.66327 4.75146L8.49984 9.84808Z"
                        fill="#94BE43"
                      />
                    </svg>
                  )}
                </Listbox.Button>
                <Listbox.Options
                  className={classnames("c-input__select-list-box", isSimple && "c-input__select-list-box--simple")}
                  static={isMultiple}
                >
                  {options.map(option => (
                    <Listbox.Option as={Fragment} key={option.value} value={option}>
                      {({ active, selected }) => (
                        <li
                          className={classnames(
                            "c-input__select-list-item",
                            active && "c-input__select-list-item--is-active",
                            selected && "c-input__select-list-item--is-selected",
                            isSimple && "c-input__select-list-item--simple"
                          )}
                        >
                          <span className="c-input__select-list-item-label">{option.label}</span>
                          {option.secondaryLabel && (
                            <span className="c-input__select-list-item-secondary-label u-text-ellipsis">
                              {option.secondaryLabel}
                            </span>
                          )}
                          {isMultiple && (
                            <img
                              src={selected ? RadioOn : RadioOff}
                              role="presentation"
                              alt=""
                              className="c-input__select-list-item-radio"
                            />
                          )}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
              <FieldError error={error} id={`${id}-error`} />
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default Select;
