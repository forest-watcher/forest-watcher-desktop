import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { teamService } from "services/teams";
import { getTeamMembers } from "modules/gfwTeams";
import { toastr } from "react-redux-toastr";
import { TErrorResponse } from "constants/api";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { FormattedMessage, useIntl } from "react-intl";

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

  const close = useCallback(() => {
    history.push(`/teams/${teamId}`);
  }, [history, teamId]);

  useEffect(() => {
    // Close the modal if the member id isn't present on team
    if (isOpen && members && !members.some(m => m.id === memberId)) {
      toastr.warning(intl.formatMessage({ id: "teams.member.invalid" }), "");
      close();
    }
  }, [close, history, intl, isOpen, memberId, members, teamId]);

  const removeTeamMember = async () => {
    setIsRemoving(true);
    try {
      await teamService.removeTeamMember({ teamId, teamUserId: memberId });
      // Refetch the Team members
      dispatch(getTeamMembers(teamId));
      close();
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
      <p>
        <FormattedMessage id="teams.remove.body" />
      </p>
    </Modal>
  );
};

export default RemoveTeamMemberModal;
