import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { Switch } from "@headlessui/react";
import { ToggleGroupProps } from "types/toggle";

export interface Props extends FieldPropsBase {
  toggleGroupProps: ToggleGroupProps;
  registered: UseFormRegisterReturn;
  formHook: UseFormReturn<any>;
  onChange?: () => void;
}

const ToggleGroup = (props: Props) => {
  const { registered, className, toggleGroupProps, formHook } = props;
  const value =
    formHook.watch(props.registered.name) === undefined
      ? toggleGroupProps.defaultValue
      : formHook.watch(props.registered.name);

  const handleChange = (v: Boolean, toggleValue: string) => {
    const newValue = value ? [...value] : [];
    const index = newValue.findIndex((item: string) => item === toggleValue);
    if (index > -1) {
      // Remove
      newValue.splice(index, 1);
    } else {
      // Add
      newValue.push(toggleValue);
    }
    formHook.setValue(registered.name, newValue);
    formHook.clearErrors(registered.name);
    props.onChange?.();
  };

  return (
    <div className="c-input-group">
      {toggleGroupProps.label && <label className="c-input-group__label">{toggleGroupProps.label}</label>}
      {toggleGroupProps.options.map(toggle => {
        const checked = value.length && Boolean(value.find((item: string) => item === toggle.value));
        return (
          <Switch.Group key={toggle.value}>
            <div className="c-input c-input--toggle c-input-group__item">
              <Switch.Label className="c-input__label c-input-group__input-label">{toggle.label}</Switch.Label>
              <Switch
                checked={checked}
                onChange={(v: boolean) => handleChange(v, toggle.value)}
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
