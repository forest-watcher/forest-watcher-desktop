import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import RadioChipGroup, { IProps } from "components/ui/Chip/RadioChipGroup";
import { FieldError } from "./FieldError";
import { useEffect } from "react";

export interface Props extends FieldPropsBase {
  radioGroupProps: IProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: () => void;
}

const RadioChipGroupFormWrapper = (props: Props) => {
  const { id, registered, className, radioGroupProps, formHook, error, onChange } = props;
  useEffect(() => {
    if (radioGroupProps.value) {
      formHook.setValue(registered.name, radioGroupProps.value);
      onChange?.();
    }
  }, [formHook, onChange, radioGroupProps.value, registered.name]);

  const handleChange = (v: string) => {
    formHook.setValue(registered.name, v);
    formHook.clearErrors(registered.name);
    props.onChange?.();
  };

  return (
    <div className={classnames("c-input", className)}>
      <div>
        <RadioChipGroup {...radioGroupProps} onChange={handleChange} />
        <FieldError error={error} id={`${id}-error`} />
      </div>
    </div>
  );
};

export default RadioChipGroupFormWrapper;
