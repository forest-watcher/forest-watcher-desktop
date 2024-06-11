import classnames from "classnames";
import { FieldPropsBase } from "types/field";
import { Switch } from "@headlessui/react";
import { ToggleProps } from "types/toggle";

export interface Props extends Partial<FieldPropsBase>, ToggleProps {
  onChange?(checked: boolean): void;
  disabled?: boolean;
  value?: boolean;
}

const Toggle = (props: Props) => {
  const { className, label, hideLabel, labelClass, value, onChange } = props;

  return (
    <div className="c-input c-input--toggle">
      <Switch.Group>
        <Switch.Label className={classnames("c-input__label", hideLabel && "u-visually-hidden", labelClass)}>
          {label}
        </Switch.Label>
        <Switch
          checked={value}
          onChange={onChange}
          className={classnames("c-input__toggle", value && "c-input__toggle--on", className)}
          disabled={props.disabled}
        >
          <span className="c-input__toggle-indicator" />
        </Switch>
      </Switch.Group>
    </div>
  );
};

export default Toggle;
