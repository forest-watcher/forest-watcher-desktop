import { FC } from "react";
import { FormattedMessage } from "react-intl";

interface FieldErrorProps {
  error?: {
    message:
      | string
      | {
          key: string;
          values: any;
        };
    [key: string]: any;
  };
  id: string;
}

export const FieldError: FC<FieldErrorProps> = ({ error, id }) => {
  if (!error) {
    return null;
  }

  return (
    <div role="alert" className="c-input__error-message" id={id}>
      <span>
        {typeof error.message === "string" ? (
          error.message
        ) : (
          <FormattedMessage id={error.message.key} values={error.message.values} />
        )}
      </span>
    </div>
  );
};
