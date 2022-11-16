import { RegisterableField } from ".";
import { FieldBase, FieldType } from "./field";

export interface SelectProps {
  label?: string;
  placeholder: string;
  options?: Option[];
  asyncFetchOptions?: () => Promise<Option[]>;
  defaultValue?: Option | Option[];
  alternateLabelStyle?: Boolean;
  largeLabel?: Boolean;
  onFocus?: () => void;
  scrollOnOpen?: boolean;
}

export interface Option {
  label: string;
  value: string | number;
  secondaryLabel?: string;
  metadata?: any;
}

export interface SelectField extends FieldBase, RegisterableField {
  fieldType: FieldType.Select;
  selectProps: SelectProps;
}
