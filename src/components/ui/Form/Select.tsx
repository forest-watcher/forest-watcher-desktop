import classnames from "classnames";
import { Fragment, useCallback, useEffect, useState } from "react";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { SelectProps, Option } from "types/select";
import errorIcon from "assets/images/icons/Error.svg";
import { FieldError } from "./FieldError";
import { Listbox } from "@headlessui/react";

export interface Props extends FieldPropsBase {
  selectProps: SelectProps;
  registered: UseFormRegisterReturn;
  formHook: Pick<UseFormReturn, "watch" | "setValue" | "clearErrors">;
  onChange: () => void;
}

const Select = (props: Props) => {
  const { selectProps, registered, error, id, formHook } = props;
  const [options, setOptions] = useState<Option[]>(selectProps.options || []);
  const value = formHook.watch(props.registered.name) || selectProps.defaultValue?.value;

  const fetchOptions = useCallback(async () => {
    if (!!selectProps.asyncFetchOptions) {
      setOptions(await selectProps.asyncFetchOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProps.asyncFetchOptions]);

  const onChange = (v: any) => {
    if (v.value) {
      props.formHook.setValue(registered.name, v?.value);
      props.formHook.clearErrors(registered.name);
      props.onChange();
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return (
    <div className={classnames("c-input", selectProps.alternateLabelStyle && "c-input--alt-label")}>
      <Listbox value={value ? options.find(opt => opt.value === value) : null} onChange={onChange}>
        {({ open }) => (
          <>
            {selectProps.label && (
              <Listbox.Label
                className={classnames(
                  "c-input__label c-input__label--select",
                  selectProps.alternateLabelStyle && "c-input__label--alt"
                )}
              >
                {selectProps.label}
              </Listbox.Label>
            )}
            <div>
              <div className={classnames("c-input__select", open && "c-input__select--open")}>
                <Listbox.Button
                  className={classnames(
                    "c-input__select-button",
                    !value && "c-input__select-button--has-placeholder",
                    open && "c-input__select-button--open",
                    error && "c-input__select-button--invalid"
                  )}
                >
                  <span className="c-input__select-value">
                    {value ? options.find(opt => opt.value === value)?.label : selectProps.placeholder}
                  </span>
                  {error ? (
                    <img alt="" role="presentation" src={errorIcon} className="c-input__select-error-icon" />
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
                <Listbox.Options className="c-input__select-list-box">
                  {options.map(option => (
                    <Listbox.Option as={Fragment} key={option.value} value={option}>
                      {({ active, selected }) => (
                        <li
                          className={classnames(
                            "c-input__select-list-item",
                            active && "c-input__select-list-item--is-active",
                            selected && "c-input__select-list-item--is-selected"
                          )}
                        >
                          {option.label}
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
