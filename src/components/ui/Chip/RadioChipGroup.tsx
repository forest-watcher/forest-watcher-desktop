import { FC, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import Chip from "./Chip";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";

export interface IProps {
  className?: string;
  labelClassName?: string;
  label?: string;
  options: {
    className?: string;
    value: string;
    name: string;
  }[];
  value?: string;
  onChange?: (v: string) => void;
}

const RadioChipGroup: FC<IProps> = props => {
  const { className, labelClassName, label, options, value = options[0].value, onChange } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => setSelectedValue(value), [value]);

  const handleChange = (value: string) => {
    onChange?.(value);
    setSelectedValue(value);
  };

  return (
    <RadioGroup value={selectedValue} onChange={handleChange} className={classnames(className, "c-radio-chip-group")}>
      {label && (
        <RadioGroup.Label className={classnames("c-radio-chip-group__label", labelClassName)}>
          <FormattedMessage id={label} />
        </RadioGroup.Label>
      )}
      <div className="c-radio-chip-group__options">
        {options.map(option => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className={classnames(option.className, "c-radio-chip-group__item")}
          >
            {({ checked }) => (
              <Chip isSelectable isSelected={checked} variant={checked ? "primary" : "secondary"}>
                <FormattedMessage id={option.name} />
              </Chip>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioChipGroup;
