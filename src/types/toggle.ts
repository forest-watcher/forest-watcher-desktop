import { RegisterableField } from ".";
import { FieldBase, FieldType } from "./field";

export interface ToggleProps {
  label?: string;
  defaultValue?: Boolean;
}

export interface ToggleGroupProps {
  label?: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string[];
}

export interface ToggleField extends FieldBase, RegisterableField {
  fieldType: FieldType.Toggle;
  toggleProps: ToggleProps;
}
