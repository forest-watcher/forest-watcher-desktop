import Loader from "components/ui/Loader";
import Modal from "components/ui/Modal/Modal";
import {
  PatchV3GfwTeamsTeamIdUsersTeamMemberRelationIdError,
  usePatchV3GfwTeamsTeamIdUsersReassignAdminUserId,
  usePatchV3GfwTeamsTeamIdUsersTeamMemberRelationId
} from "generated/core/coreComponents";
import { fireGAEvent } from "helpers/analytics";
import useGetTeamDetails from "hooks/querys/teams/useGetTeamDetails";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toastr } from "react-redux-toastr";
import { useHistory, useParams } from "react-router-dom";
import { TeamActions, TeamLabels } from "types/analytics";
import { TParams as TTeamDetailParams } from "../TeamDetail";

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
  const { data: team, isLoading: isTeamLoading } = useGetTeamDetails(teamId);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  // Update a Team Member's Role
  const { mutateAsync: updateTeamMemberRole, isSuccess: hasUpdatedMutated } =
    usePatchV3GfwTeamsTeamIdUsersTeamMemberRelationId();
  // Reassign Team Administrator
  const { mutateAsync: reassignTeamAdmin, isSuccess: hasReassignedMutated } =
    usePatchV3GfwTeamsTeamIdUsersReassignAdminUserId();

  const close = useCallback(() => {
    history.push(`/teams/${teamId}`);
  }, [history, teamId]);

  useEffect(() => {
    // If a successful mutation has happened, don't see if an error occurred (because it couldn't have)
    if (hasUpdatedMutated || hasReassignedMutated) return;

    // In case the URL ends in anything else: /teams/:teamId/edit/:memberId/:memberRole
    if (isOpen && memberRole && memberRole !== "manager" && memberRole !== "monitor" && memberRole !== "admin") {
      close();
    }
    // Close the modal if the member id isn't present on team
    if (
      isOpen &&
      !isTeamLoading &&
      // @ts-ignore `_id` not type check
      !team?.attributes?.members?.some(m => m._id === memberId)
    ) {
      toastr.warning(intl.formatMessage({ id: "teams.member.invalid" }), "");
      close();
    }
  }, [close, intl, hasUpdatedMutated, hasReassignedMutated, isOpen, isTeamLoading, memberId, memberRole, team]);

  const editTeamMember = async () => {
    setIsSaving(true);
    try {
      if (memberRole !== "admin") {
        await updateTeamMemberRole({
          headers: httpAuthHeader,
          pathParams: { teamId, teamMemberRelationId: memberId },
          body: { role: memberRole }
        });

        if (memberRole === "manager") {
          fireGAEvent({
            category: "Teams",
            action: TeamActions.teamManagement,
            label: TeamLabels.MakeManager
          });
        }
      } else {
        await reassignTeamAdmin({ headers: httpAuthHeader, pathParams: { teamId, userId: memberId } });
      }

      // Ensure the Team Listing and Team Details caches are invalidated, forcing a re-fetched
      await invalidateGetUserTeams(teamId);

      close();
      toastr.success(intl.formatMessage({ id: "teams.change.member.success" }), "");
    } catch (e: any) {
      const error = e as PatchV3GfwTeamsTeamIdUsersTeamMemberRelationIdError;
      toastr.error(
        intl.formatMessage({ id: "teams.change.member.error" }),
        typeof error.payload === "string" ? "" : error.payload.message!
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
