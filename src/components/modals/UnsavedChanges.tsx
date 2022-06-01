import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import { FormattedMessage } from "react-intl";

interface IProps {
  isOpen: boolean;
  leaveCallBack: () => void;
  stayCallBack: () => void;
}

const UnsavedChanges: FC<IProps> = props => {
  const { isOpen, leaveCallBack, stayCallBack } = props;

  return (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title="common.unsaved.changes"
      onClose={leaveCallBack}
      actions={[
        { name: "common.stay", onClick: stayCallBack },
        { name: "common.leave.page", variant: "secondary", onClick: leaveCallBack }
      ]}
    >
      <div className="c-are-you-sure-modal">
        <p>
          <FormattedMessage id="common.unsaved.changes.desc.1" />
        </p>
        <p>
          <FormattedMessage id="common.unsaved.changes.desc.2" />
        </p>
      </div>
    </Modal>
  );
};

export default UnsavedChanges;
