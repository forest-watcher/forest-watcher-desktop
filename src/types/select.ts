import { RegisterableField } from ".";
import { FieldBase, FieldType } from "./field";

export interface SelectProps {
  label?: string;
  placeholder: string;
  options?: Option[];
  asyncFetchOptions?: () => Promise<Option[]>;
  defaultValue?: Option;
  alternateLabelStyle?: Boolean;
}

export interface Option {
  label: string;
  value: string;
  metadata?: any;
}

export interface SelectField extends FieldBase, RegisterableField {
  fieldType: FieldType.Select;
  selectProps: SelectProps;
}