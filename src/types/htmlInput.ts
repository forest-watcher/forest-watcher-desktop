import { FieldBase, FieldType } from "./field";
import { RegisterableField } from ".";

export interface InputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  title?: string;
  label?: string;
  placeholder: string;
  type: string;
  alternateLabelStyle?: boolean;
  largeLabel?: boolean;
}

export interface HTMLInputField extends FieldBase, RegisterableField {
  fieldType: FieldType.Input;
  htmlInputProps: InputProps;
}
