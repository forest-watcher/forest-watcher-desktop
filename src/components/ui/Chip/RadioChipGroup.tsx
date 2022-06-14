import { FC, HTMLAttributes, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import Chip from "./Chip";

interface IProps extends HTMLAttributes<HTMLElement> {}

const RadioChipGroup: FC<IProps> = props => {

  const [plan, setPlan] = useState("email");

  return (
    <RadioGroup value={plan} onChange={setPlan} className="c-radio-chip-group">
      <RadioGroup.Label className="c-radio-chip-group__label">Select an export type</RadioGroup.Label>
      <RadioGroup.Option value="email" className="c-radio-chip-group__item">
        {({ checked }) => (
          <Chip isSelectable variant={checked ? "primary" : "secondary"}>
            Email
          </Chip>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="Zip" className="c-radio-chip-group__item">
        {({ checked }) => (
          <Chip isSelectable variant={checked ? "primary" : "secondary"}>
            Zip Download
          </Chip>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="Pigeon" className="c-radio-chip-group__item">
        {({ checked }) => (
          <Chip isSelectable variant={checked ? "primary" : "secondary"}>
            Carrier Pigeon
          </Chip>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
};

export default RadioChipGroup;
