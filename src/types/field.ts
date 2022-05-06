import { RegisterOptions } from "react-hook-form";
import { HTMLInputField } from "./htmlInput";

export type Field = HTMLInputField;

export enum FieldType {
  Input = "input"
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
