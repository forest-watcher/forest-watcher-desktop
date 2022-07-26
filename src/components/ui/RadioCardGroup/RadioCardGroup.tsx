import { FC, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import Card from "../Card/Card";

export interface IProps {
  className?: string;
  labelClassName?: string;
  label?: string;
  optionsClassName?: string;
  options: {
    className?: string;
    value: string;
    name: string;
    image: string;
  }[];
  value?: string;
  onChange?: (v: string) => void;
}

const RadioCardGroup: FC<IProps> = props => {
  const { className, labelClassName, label, options, value = options[0].value, onChange, optionsClassName } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => setSelectedValue(value), [value]);

  const handleChange = (value: string) => {
    onChange?.(value);
    setSelectedValue(value);
  };

  return (
    <RadioGroup
      value={selectedValue}
      onChange={handleChange}
      className={classnames(className, "c-radio-card-group", "c-input-group")}
    >
      {label && (
        <RadioGroup.Label className={classnames("c-radio-card-group__label c-input-group__label", labelClassName)}>
          <FormattedMessage id={label} />
        </RadioGroup.Label>
      )}
      <div className={classnames(optionsClassName ? optionsClassName : "c-radio-card-group__options")}>
        {options.map(option => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className={classnames(option.className, "c-radio-card-group__item")}
          >
            {({ checked }) => (
              <Card size="small" className={classnames(checked && "c-card--checked")}>
                <Card.Image alt="" role="presentation" src={option.image} />
                <Card.Title>{option.name}</Card.Title>
              </Card>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioCardGroup;
