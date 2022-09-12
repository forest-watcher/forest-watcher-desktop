import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { FieldError } from "./FieldError";
import { useEffect } from "react";
import RadioCardGroup, { IProps } from "components/ui/RadioCardGroup/RadioCardGroup";

export interface Props extends FieldPropsBase {
  radioGroupProps: IProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: (v: string) => void;
}

const RadioCardGroupWrapper = (props: Props) => {
  const { id, registered, className, radioGroupProps, formHook, error } = props;

  useEffect(() => {
    if (radioGroupProps.value) {
      formHook.setValue(registered.name, radioGroupProps.value);
    }
  }, [formHook, radioGroupProps.value, registered.name]);

  const handleChange = (v: string) => {
    formHook.setValue(registered.name, v);
    formHook.clearErrors(registered.name);
    props.onChange?.(v);
  };

  return (
    <div className={classnames("c-input", className)}>
      <div>
        <RadioCardGroup {...radioGroupProps} onChange={handleChange} />
        <FieldError error={error} id={`${id}-error`} />
      </div>
    </div>
  );
};

export default RadioCardGroupWrapper;
