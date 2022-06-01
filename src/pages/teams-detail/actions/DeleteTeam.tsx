import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory, useLocation } from "react-router-dom";

interface IProps {
  isOpen: boolean;
}

const DeleteTeam: FC<IProps> = props => {
  const { isOpen } = props;
  const history = useHistory();

  const close = () => {
    history.goBack();
  };

  const deleteTeam = () => {};

  return (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title="teams.details.delete"
      onClose={close}
      actions={[
        { name: "teams.details.delete", onClick: deleteTeam },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    />
  );
};

export default DeleteTeam;
