import {
  usePatchV3GfwTeamsTeamIdUsersReassignAdminUserId,
  usePatchV3GfwTeamsTeamIdUsersTeamMemberRelationId
} from "generated/core/coreComponents";
import useGetTeamDetails from "hooks/querys/teams/useGetTeamDetails";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { useHistory, useParams } from "react-router-dom";
import { teamService } from "services/teams";
import { toastr } from "react-redux-toastr";
import { FormattedMessage, useIntl } from "react-intl";
import { TErrorResponse } from "constants/api";

type TParams = TTeamDetailParams & {
  memberRole: "manager" | "monitor" | "admin";
  memberId: string;
};

interface IProps {
  isOpen: boolean;
}

const EditMemberRoleModal: FC<IProps> = props => {
  const { isOpen } = props;
  const { teamId, memberRole, memberId } = useParams<TParams>();
  const intl = useIntl();
  const history = useHistory();
  const [isSave, setIsSaving] = useState(false);

  /* Queries */
  // ToDo: change this to the get members util hook
  const { data: team, isLoading: isTeamLoading } = useGetTeamDetails(teamId);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  // Update a Team Member's Role
  const { mutateAsync: updateTeamMemberRole } = usePatchV3GfwTeamsTeamIdUsersTeamMemberRelationId();
  // Reassign Team Administrator
  const { mutateAsync: reassignTeamAdmin } = usePatchV3GfwTeamsTeamIdUsersReassignAdminUserId();

  const close = useCallback(() => {
    history.push(`/teams/${teamId}`);
  }, [history, teamId]);

  useEffect(() => {
    // In case the URL ends in anything else: /teams/:teamId/edit/:memberId/:memberRole
    if (isOpen && memberRole && memberRole !== "manager" && memberRole !== "monitor" && memberRole !== "admin") {
      close();
    }
    // Close the modal if the member id isn't present on team
    if (isOpen && !isTeamLoading && !team?.attributes?.members?.some(m => m.userId === memberId)) {
      toastr.warning(intl.formatMessage({ id: "teams.member.invalid" }), "");
      close();
    }
  }, [close, intl, isOpen, isTeamLoading, memberId, memberRole, team]);

  const editTeamMember = async () => {
    setIsSaving(true);
    try {
      if (memberRole !== "admin") {
        await updateTeamMemberRole({
          pathParams: { teamId, teamMemberRelationId: memberId },
          body: { role: memberRole }
        });
      } else {
        await reassignTeamAdmin({ pathParams: { teamId, userId: memberId } });
      }

      // Ensure the Team Listing and Team Details caches are invalidated, forcing a re-fetched
      await invalidateGetUserTeams(teamId);

      close();
      toastr.success(intl.formatMessage({ id: "teams.change.member.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "teams.change.member.error" }),
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
      <p>
        <FormattedMessage id={`teams.change.member.to.${memberRole}.body`} />
      </p>
    </Modal>
  );
};

export default EditMemberRoleModal;
