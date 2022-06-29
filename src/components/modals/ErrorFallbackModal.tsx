import Modal from "components/ui/Modal/Modal";
import { FC } from "react";
import { FallbackProps } from "react-error-boundary";
import { FormattedMessage } from "react-intl";

const ErrorFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <Modal
      isOpen
      onClose={() => {
        resetErrorBoundary();
      }}
      title="errors.boundary.title"
      actions={[
        {
          name: "errors.boundary.submit",
          onClick: () => {
            resetErrorBoundary();
          }
        }
      ]}
    >
      <p className="c-modal-dialog__text ">
        <FormattedMessage id="errors.boundary.message" />
      </p>
    </Modal>
  );
};

export default ErrorFallback;
