import { RegisterOptions } from "react-hook-form";
import { HTMLInputField } from "./htmlInput";
import { SelectField } from "./select";

export type Field = HTMLInputField | SelectField;

export enum FieldType {
  Input = "input",
  Select = "select"
}

export interface FieldPropsBase {
  id: string;
  className?: string;
  error?: any;
}

export interface FieldBase extends FieldPropsBase {
  id: string;
}

export interface RegisterableField {
  ref?: any;
  model: string;
  registerOptions?: RegisterOptions;
}
