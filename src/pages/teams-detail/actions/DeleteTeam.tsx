import { FC, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import Loader from "../../../components/ui/Loader";
import { useIntl } from "react-intl";

interface IProps {
  isOpen: boolean;
  teamId: string;
}

const DeleteTeam: FC<IProps> = props => {
  const { isOpen, teamId } = props;
  const intl = useIntl();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);

  const close = () => {
    history.push(`/teams/${teamId}`);
  };

  const deleteTeam = async () => {
    setIsDeleting(true);
    try {
      await teamService.deleteTeam(teamId);
      history.push("/teams");
      toastr.success(intl.formatMessage({ id: "teams.delete.success" }), "");
    } catch (e) {
      toastr.error(intl.formatMessage({ id: "teams.delete.error" }), "");
      console.error(e);
    }
    setIsDeleting(false);
  };

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
    >
      <Loader isLoading={isDeleting} />
    </Modal>
  );
};

export default DeleteTeam;
