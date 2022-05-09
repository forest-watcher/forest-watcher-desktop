import classnames from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { InputProps } from "types/htmlInput";
import errorIcon from "assets/images/icons/Error.svg";
import { FieldError } from "./FieldError";

export interface Props extends FieldPropsBase {
  htmlInputProps: InputProps;
  registered: UseFormRegisterReturn;
  onChange: () => void;
}

const Input = (props: Props) => {
  const { id, registered, className, htmlInputProps, error } = props;
  return (
    <div className="c-input">
      {htmlInputProps.label && (
        <label
          htmlFor={id}
          className={classnames(
            "c-input__label",
            `c-input__label--${htmlInputProps.type}`,
            htmlInputProps.hiddenLabel && "u-visually-hidden"
          )}
        >
          {htmlInputProps.label}
        </label>
      )}
      <div className="c-input__input-wrapper">
        <input
          {...htmlInputProps}
          {...registered}
          id={id}
          className={classnames(
            className,
            "c-input__input",
            `c-input__input--${htmlInputProps.type}`,
            error && "c-input__input--error"
          )}
          ref={registered.ref}
          title={htmlInputProps.title}
          onChangeCapture={() => props.onChange()}
          placeholder={htmlInputProps.placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-errormessage={`${id}-error`}
        />
        {error && <img alt="" src={errorIcon} role="presentation" className="c-input__error-icon" />}
        <FieldError error={error} id={`${id}-error`} />
      </div>
    </div>
  );
};

export default Input;
