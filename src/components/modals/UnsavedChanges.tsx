import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import { FormattedMessage } from "react-intl";

interface IProps {
  isOpen: boolean;
  yesCallBack: () => void;
  noCallBack: () => void;
}

const UnsavedChanges: FC<IProps> = props => {
  const { isOpen, yesCallBack, noCallBack } = props;

  return (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title="common.unsaved.changes"
      onClose={yesCallBack}
      actions={[
        { name: "common.stay", onClick: noCallBack },
        { name: "common.leave.page", variant: "secondary", onClick: yesCallBack }
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
