import OptionalWrapper from "components/extensive/OptionalWrapper";
import { Fragment } from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { Path, PathValue, UnpackNestedValue, useController, UseControllerProps } from "react-hook-form";

export interface IProps<T> {
  label?: string;
  options: { label: string; key: string; value: UnpackNestedValue<PathValue<T, Path<T>>> }[];
}

const RadioGroup = <T,>(props: IProps<T> & UseControllerProps<T>) => {
  const { label, options, ...controlProps } = props;
  const { field } = useController(controlProps);

  return (
    <>
      <HeadlessRadioGroup className="text-gray-700 w-full" {...field}>
        <OptionalWrapper data={!!label}>
          <HeadlessRadioGroup.Label className="block mb-3 text-[14px] font-medium uppercase">
            <FormattedMessage id={label} />
          </HeadlessRadioGroup.Label>
        </OptionalWrapper>

        <div className="grid grid-cols-2 gap-3">
          {options.map(option => (
            <HeadlessRadioGroup.Option key={option.key} value={option.value} as={Fragment}>
              {({ checked }) => (
                <span
                  className={classnames(
                    "border border-solid py-[9px] px-4 rounded-md flex-1 text-center cursor-pointer text-base",
                    !checked && "border-gray-500",
                    checked && "border-green-500 bg-green-400"
                  )}
                >
                  <FormattedMessage id={option.label} />
                </span>
              )}
            </HeadlessRadioGroup.Option>
          ))}
        </div>
      </HeadlessRadioGroup>
    </>
  );
};

export default RadioGroup;
