import { FC } from "react";
import Modal, { IProps as ModalProps } from "components/ui/Modal/Modal";
import { FormattedMessage } from "react-intl";

interface IProps extends Omit<ModalProps, "title"> {
  isOpen: boolean;
  leaveCallBack: () => void;
  stayCallBack: () => void;
}

/**
 * * Note that this component, if part of another modal, should be nested
 * * within that modal. Otherwise the overflow:hidden technique to stop
 * * scrolling will break.
 * * https://github.com/tailwindlabs/headlessui/issues/1985#issuecomment-1309511622
 */
const UnsavedChanges: FC<IProps> = props => {
  const { isOpen, leaveCallBack, stayCallBack, ...rest } = props;

  return (
    <Modal
      {...rest}
      isOpen={isOpen}
      dismissible={false}
      title="common.unsaved.changes"
      onClose={stayCallBack}
      actions={[
        { name: "common.stay", onClick: stayCallBack },
        { name: "common.leave.page", variant: "secondary", onClick: leaveCallBack }
      ]}
    >
      <p>
        <FormattedMessage id="common.unsaved.changes.desc.1" />
      </p>
      <p>
        <FormattedMessage id="common.unsaved.changes.desc.2" />
      </p>
    </Modal>
  );
};

export default UnsavedChanges;
