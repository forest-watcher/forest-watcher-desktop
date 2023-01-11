import classnames from "classnames";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { UseControllerProps, useController, ControllerRenderProps } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldError } from "../FieldError";
import errorIcon from "assets/images/icons/Error.svg";
export interface IProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  wrapperClassName?: string;
  label?: string;
  hideLabel?: boolean;
  altLabel?: boolean;
  error?: any;
}

const TextAreaControlled = <T extends Record<any, any>>(
  props: UseControllerProps<T> & Omit<IProps, keyof ControllerRenderProps<T>>
) => {
  const {
    wrapperClassName,
    label,
    hideLabel,
    altLabel,
    className,
    id,
    rows = 4,
    placeholder,
    // UseControllerProps
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    error,
    ...rest
  } = props;

  const intl = useIntl();
  const { field } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister
  });

  return (
    <div className={classnames("c-input", altLabel && "c-input--alt-label", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={classnames("c-input__label", hideLabel && "u-visually-hidden", altLabel && "mt-0")}
        >
          <FormattedMessage id={label} />
        </label>
      )}
      <div className="c-input__input-wrapper">
        <textarea
          className={classnames("c-input__input w-full resize-y", error && "c-input__input--error", className)}
          rows={rows}
          id={id}
          placeholder={placeholder ? intl.formatMessage({ id: placeholder }) : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-errormessage={`${id}-error`}
          {...field}
          {...rest}
        />
        {error && <img alt="" src={errorIcon} role="presentation" className="c-input__error-icon" />}
        <FieldError error={error} id={`${id}-error`} />
      </div>
    </div>
  );
};

export default TextAreaControlled;
