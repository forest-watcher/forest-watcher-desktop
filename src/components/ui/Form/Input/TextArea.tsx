import classnames from "classnames";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { UseControllerProps, useController, ControllerRenderProps } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export interface IProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  wrapperClassName?: string;
  label?: string;
  hideLabel?: boolean;
  altLabel?: boolean;
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

      <textarea
        className={classnames("c-input__input w-full resize-y", className)}
        rows={rows}
        id={id}
        placeholder={placeholder ? intl.formatMessage({ id: placeholder }) : undefined}
        {...field}
        {...rest}
      />
    </div>
  );
};

export default TextAreaControlled;
