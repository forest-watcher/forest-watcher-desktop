import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { Switch } from "@headlessui/react";
import { ToggleGroupProps } from "types/toggle";

export interface IProps extends FieldPropsBase {
  toggleGroupProps: ToggleGroupProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: (selectedOption: Option, enabled: Boolean) => void;
}
interface Option {
  label: string;
  value: string;
}

const ToggleGroup = (props: IProps) => {
  const { registered, className, toggleGroupProps, formHook, hideLabel } = props;
  const value =
    formHook.watch(props.registered.name) === undefined
      ? toggleGroupProps.defaultValue
      : formHook.watch(props.registered.name);

  const handleChange = (v: Boolean, toggle: Option) => {
    const newValue = value ? [...value] : [];
    const index = newValue.findIndex((item: string) => item === toggle.value);
    if (index > -1) {
      // Remove
      newValue.splice(index, 1);
    } else {
      // Add
      newValue.push(toggle.value);
    }
    formHook.setValue(registered.name, newValue);
    formHook.clearErrors(registered.name);
    props.onChange?.(toggle, v);
  };

  return (
    <div className="c-input-group">
      {toggleGroupProps.label && (
        <label className={classnames("c-input-group__label", hideLabel && "u-visually-hidden")}>
          {toggleGroupProps.label}
        </label>
      )}
      {toggleGroupProps.options.map(toggle => {
        const checked = value?.length && Boolean(value.find((item: string) => item === toggle.value));
        return (
          <Switch.Group key={toggle.value}>
            <div className="c-input c-input--toggle c-input-group__item">
              <Switch.Label className="c-input__label c-input-group__input-label">{toggle.label}</Switch.Label>
              <Switch
                checked={checked}
                onChange={(v: boolean) => handleChange(v, toggle)}
                className={classnames("c-input__toggle", checked && "c-input__toggle--on", className)}
              >
                <span className="c-input__toggle-indicator" />
              </Switch>
            </div>
          </Switch.Group>
        );
      })}
    </div>
  );
};

export default ToggleGroup;
