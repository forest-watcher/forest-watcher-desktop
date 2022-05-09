import classnames from "classnames";
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { Switch } from "@headlessui/react";
import { ToggleProps } from "types/toggle";

export interface Props extends FieldPropsBase {
  toggleProps: ToggleProps;
  registered: UseFormRegisterReturn;
  formHook: Pick<UseFormReturn, "watch" | "setValue" | "clearErrors">;
  onChange: () => void;
}

const Toggle = (props: Props) => {
  const { registered, className, toggleProps, formHook } = props;
  const value =
    formHook.watch(props.registered.name) === undefined
      ? toggleProps.defaultValue
      : formHook.watch(props.registered.name);

  const handleChange = (v: Boolean) => {
    formHook.setValue(registered.name, v);
    formHook.clearErrors(registered.name);
    props.onChange();
  };

  return (
    <div className="c-input">
      <Switch
        checked={value}
        onChange={handleChange}
        className={classnames("c-input__toggle", value && "c-input__toggle--on", className)}
      >
        <span className="u-visually-hidden">{toggleProps.label}</span>
        <span className="c-input__toggle-indicator" />
      </Switch>
    </div>
  );
};

export default Toggle;
