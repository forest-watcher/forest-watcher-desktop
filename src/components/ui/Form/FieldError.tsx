import { FC } from "react";

interface FieldErrorProps {
  error?: {
    message: string;
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
      <span>{error.message}</span>
    </div>
  );
};
