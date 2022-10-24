import { FC, useState } from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";

export interface IProps {}

const plans = [
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk"
  },
  {
    name: "Business",
    ram: "16GB",
    cpus: "8 CPUs",
    disk: "512 GB SSD disk"
  }
];

const RadioGroup: FC<IProps> = props => {
  const {} = props;
  const [selected, setSelected] = useState(plans[0]);

  return (
    <>
      <HeadlessRadioGroup value={selected} onChange={setSelected}>
        {plans.map(plan => (
          <HeadlessRadioGroup.Option key={plan.name} value={plan}>
            {({ checked }) => <span className={checked ? "bg-blue-200" : ""}>{plan.name}</span>}
          </HeadlessRadioGroup.Option>
        ))}
      </HeadlessRadioGroup>
    </>
  );
};

export default RadioGroup;
