import { FC, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { useHistory, useParams } from "react-router-dom";

type TParams = TTeamDetailParams & {
  memberRole: "manager" | "monitor";
  memberId: string;
};

interface IProps {
  isOpen: boolean;
}

const EditMemberRoleModal: FC<IProps> = props => {
  const { isOpen } = props;
  const { teamId, memberRole, memberId } = useParams<TParams>();
  const history = useHistory();
  const [isSave, setIsSaving] = useState(false);

  useEffect(() => {
    // In case the URL ends in anything else: /teams/:teamId/edit/:memberId/:memberRole
    if (isOpen && memberRole && memberRole !== "manager" && memberRole !== "monitor") {
      history.push(`/teams/${teamId}`);
    }
  }, [history, memberRole, isOpen, teamId]);

  const close = () => {
    history.push(`/teams/${teamId}`);
  };

  const editTeamMember = () => {
    setIsSaving(true);
    close();
    setIsSaving(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title={memberRole ? `teams.change.member.to.${memberRole}` : "common.edit"}
      onClose={close}
      actions={[
        { name: "common.confirm", onClick: editTeamMember },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isSave} />
    </Modal>
  );
};

export default EditMemberRoleModal;
