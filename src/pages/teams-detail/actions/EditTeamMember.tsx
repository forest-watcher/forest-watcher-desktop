import { FC, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { useHistory, useParams } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { useIntl } from "react-intl";
import { useAppDispatch } from "hooks/useRedux";
import { getTeamMembers } from "modules/gfwTeams";
import { TErrorResponse } from "constants/api";

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
  const intl = useIntl();
  const dispatch = useAppDispatch();
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

  const editTeamMember = async () => {
    setIsSaving(true);
    try {
      await teamService.updateTeamMember({ teamId, teamUserId: memberId }, { role: memberRole });
      // Refetch the Team members
      dispatch(getTeamMembers(teamId));
      history.push(`/teams/${teamId}`);
      toastr.success(intl.formatMessage({ id: "teams.change.member.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "teams.change.member.success.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
    }
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
