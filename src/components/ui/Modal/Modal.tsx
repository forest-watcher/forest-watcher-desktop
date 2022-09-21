import { FC, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FormattedMessage } from "react-intl";
import Button, { IButtonVariants } from "components/ui/Button/Button";
import CloseIcon from "assets/images/icons/CloseLg.svg";

export interface IProps {
  isOpen: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  title: string;
  actions?: {
    name: string;
    values?: { [key: string]: string };
    variant?: IButtonVariants;
    onClick: () => void;
  }[];
}

const Modal: FC<PropsWithChildren<IProps>> = props => {
  const { isOpen, onClose, title, actions, dismissible = true, children } = props;

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      enterFrom="c-modal-dialog--animate"
      leaveTo="c-modal-dialog--animate"
    >
      <Dialog className="c-modal-dialog__container" onClose={dismissible && onClose ? onClose : () => {}}>
        <div className="c-modal-dialog__backdrop" aria-hidden="true" />

        <Dialog.Panel className="c-modal-dialog">
          <Dialog.Title className="c-modal-dialog__title">
            <FormattedMessage id={title} />
            {onClose && (
              <button className="c-button c-modal-dialog__close-btn" onClick={onClose}>
                <img alt="" src={CloseIcon} role="presentation" />
              </button>
            )}
          </Dialog.Title>

          <div className="c-modal-dialog__body">{children}</div>

          {actions && (
            <div className="c-modal-dialog__actions">
              {actions.map(action => (
                <Button key={action.name} onClick={action.onClick} variant={action.variant}>
                  <FormattedMessage id={action.name} values={action.values} />
                </Button>
              ))}
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default Modal;
