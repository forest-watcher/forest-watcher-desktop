import { FC, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { teamService } from "services/teams";
import { getTeamMembers } from "modules/gfwTeams";
import { toastr } from "react-redux-toastr";
import { TErrorResponse } from "constants/api";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useIntl } from "react-intl";

type TParams = TTeamDetailParams & {
  memberId: string;
};

interface IProps {
  isOpen: boolean;
}

const RemoveTeamMemberModal: FC<IProps> = props => {
  const { isOpen } = props;
  const { teamId, memberId } = useParams<TParams>();
  const history = useHistory();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const members = useAppSelector(state => state.gfwTeams.members[teamId]);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Close the modal if the member id isn't present on team
    if (isOpen && members && !members.some(m => m.id === memberId)) {
      history.push(`/teams/${teamId}`);
    }
  }, [history, isOpen, memberId, members, teamId]);

  const close = () => {
    history.push(`/teams/${teamId}`);
  };

  const removeTeamMember = async () => {
    setIsRemoving(true);
    try {
      await teamService.removeTeamMember({ teamId, teamUserId: memberId });
      // Refetch the Team members
      dispatch(getTeamMembers(teamId));
      history.push(`/teams/${teamId}`);
      toastr.success(intl.formatMessage({ id: "teams.remove.member.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "teams.remove.member.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
    }
    setIsRemoving(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title={"teams.remove.member"}
      onClose={close}
      actions={[
        { name: "common.confirm", onClick: removeTeamMember },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isRemoving} />
    </Modal>
  );
};

export default RemoveTeamMemberModal;
