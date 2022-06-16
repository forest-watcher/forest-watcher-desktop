import { FC, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import Chip from "./Chip";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";

interface IProps {
  className?: string;
  value?: string;
  onChange: (v: string) => void;
  options: {
    className?: string;
    value: string;
    name: string;
  }[];
}

const RadioChipGroup: FC<IProps> = props => {
  const { className, options, value = options[0].value, onChange } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => setSelectedValue(value), [value]);

  const handleChange = (value: string) => {
    onChange(value);
    setSelectedValue(value);
  };

  return (
    <RadioGroup value={selectedValue} onChange={handleChange} className={classnames(className, "c-radio-chip-group")}>
      <RadioGroup.Label className="c-radio-chip-group__label">Select an export type</RadioGroup.Label>
      {options.map(option => (
        <RadioGroup.Option
          key={option.value}
          value={option.value}
          className={classnames(option.className, "c-radio-chip-group__item")}
        >
          {({ checked }) => (
            <Chip isSelectable variant={checked ? "primary" : "secondary"}>
              <FormattedMessage id={option.name} />
            </Chip>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export default RadioChipGroup;
