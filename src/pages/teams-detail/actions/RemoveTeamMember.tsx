import {
  DeleteV3GfwTeamsTeamIdUsersTeamMemberRelationIdError,
  useDeleteV3GfwTeamsTeamIdUsersTeamMemberRelationId
} from "generated/core/coreComponents";
import useGetTeamDetails from "hooks/querys/teams/useGetTeamDetails";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TTeamDetailParams } from "../TeamDetail";
import { toastr } from "react-redux-toastr";
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
  const [isRemoving, setIsRemoving] = useState(false);

  /* Queries */
  // ToDo: change this to the get members util hook
  const { data: team, isLoading: isTeamLoading } = useGetTeamDetails(teamId);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  // Removed the team member from the team
  const { mutateAsync: deleteTeamMember } = useDeleteV3GfwTeamsTeamIdUsersTeamMemberRelationId();

  const close = useCallback(() => {
    history.push(`/teams/${teamId}`);
  }, [history, teamId]);

  useEffect(() => {
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
  }, [close, intl, isOpen, isTeamLoading, memberId, team]);

  const removeTeamMember = async () => {
    setIsRemoving(true);
    try {
      await deleteTeamMember({ headers: httpAuthHeader, pathParams: { teamId, teamMemberRelationId: memberId } });

      // Ensure the Team Listing and Team Details caches are invalidated, forcing a re-fetched
      await invalidateGetUserTeams(teamId);

      close();
      toastr.success(intl.formatMessage({ id: "teams.remove.member.success" }), "");
    } catch (e: any) {
      const error = e as DeleteV3GfwTeamsTeamIdUsersTeamMemberRelationIdError;
      toastr.error(
        intl.formatMessage({ id: "teams.remove.member.error" }),
        typeof error.payload === "string" ? "" : error.payload.message!
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
