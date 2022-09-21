import { FC } from "react";
import { RadioGroup } from "@headlessui/react";
import Chip from "../Chip/Chip";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export interface IProps {
  className?: string;
  value: string;
  options: {
    className?: string;
    value: string;
    name: string;
    href: string | ((value: string) => string);
  }[];
}

const TabGroup: FC<IProps> = props => {
  const { className, options, value } = props;

  return (
    <RadioGroup value={value} onChange={() => {}} className={classnames(className, "c-tab-group")}>
      {options.map(option => (
        <RadioGroup.Option
          key={option.value}
          value={option.value}
          className={classnames(option.className, "c-tab-group__item")}
        >
          {({ checked }) => (
            <Link to={typeof option.href === "function" ? option.href(option.value) : option.href}>
              <Chip isSelectable isSelected={checked} variant="secondary-light-text">
                <FormattedMessage id={option.name} />
              </Chip>
            </Link>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export default TabGroup;
