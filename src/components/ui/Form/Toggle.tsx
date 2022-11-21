import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { Switch } from "@headlessui/react";
import { ToggleProps } from "types/toggle";

export interface Props extends FieldPropsBase {
  toggleProps: ToggleProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: () => void;
  getValue?: (val: any) => boolean;
  setValue?: (checked: boolean) => any;
}

const Toggle = (props: Props) => {
  const { registered, className, toggleProps, formHook, hideLabel, labelClass, getValue, setValue } = props;
  const value =
    formHook.watch(props.registered.name) === undefined
      ? toggleProps.defaultValue
      : formHook.watch(props.registered.name);

  const handleChange = (v: boolean) => {
    formHook.setValue(registered.name, setValue ? setValue(v) : v, { shouldDirty: true });
    formHook.clearErrors(registered.name);
    props.onChange?.();
  };

  const parsedValue = getValue ? getValue(value) : value;

  return (
    <div className="c-input c-input--toggle">
      <Switch.Group>
        <Switch.Label className={classnames("c-input__label", hideLabel && "u-visually-hidden", labelClass)}>
          {toggleProps.label}
        </Switch.Label>
        <Switch
          checked={parsedValue}
          onChange={handleChange}
          className={classnames("c-input__toggle", parsedValue && "c-input__toggle--on", className)}
        >
          <span className="c-input__toggle-indicator" />
        </Switch>
      </Switch.Group>
    </div>
  );
};

export default Toggle;
