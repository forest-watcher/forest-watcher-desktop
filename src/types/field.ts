import { RegisterOptions } from "react-hook-form";
import { boolean } from "yup";
import { HTMLInputField } from "./htmlInput";
import { SelectField } from "./select";
import { ToggleField } from "./toggle";

export type Field = HTMLInputField | SelectField | ToggleField;

export enum FieldType {
  Input = "input",
  Select = "select",
  Toggle = "toggle"
}

export interface FieldPropsBase {
  id: string;
  className?: string;
  error?: any;
  hideLabel?: boolean;
}

export interface FieldBase extends FieldPropsBase {
  id: string;
}

export interface RegisterableField {
  ref?: any;
  model: string;
  registerOptions?: RegisterOptions;
}