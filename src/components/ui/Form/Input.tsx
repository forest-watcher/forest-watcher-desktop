import classnames from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldPropsBase } from "types/field";
import { InputProps } from "types/htmlInput";
import errorIcon from "assets/images/icons/Error.svg";
import { FieldError } from "./FieldError";

export interface Props extends FieldPropsBase {
  htmlInputProps: InputProps;
  registered: UseFormRegisterReturn;
  onChange?: () => void;
}

const Input = (props: Props) => {
  const {
    id,
    registered,
    className,
    htmlInputProps,
    error,
    hideLabel = false,
    alternateLabelStyle = false,
    largeLabel = false,
    wrapperClassName
  } = props;

  return (
    <div className={classnames("c-input", alternateLabelStyle && "c-input--alt-label", className)}>
      {htmlInputProps.label && (
        <label
          htmlFor={id}
          className={classnames(
            "c-input__label",
            `c-input__label--${htmlInputProps.type}`,
            hideLabel && "u-visually-hidden",
            alternateLabelStyle && "c-input__label--alt",
            largeLabel && "c-input__label--large"
          )}
        >
          {htmlInputProps.label}
        </label>
      )}
      <div className={classnames("c-input__input-wrapper", wrapperClassName)}>
        <input
          {...htmlInputProps}
          {...registered}
          id={id}
          className={classnames(
            "c-input__input",
            `c-input__input--${htmlInputProps.type}`,
            error && "c-input__input--error",
            htmlInputProps.className
          )}
          ref={registered.ref}
          title={htmlInputProps.title}
          onChangeCapture={() => props.onChange?.()}
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
