import { useDeleteV3GfwTeamsTeamId } from "generated/core/coreComponents";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { TErrorResponse } from "constants/api";
import { fireGAEvent } from "helpers/analytics";
import { TeamActions, TeamLabels } from "types/analytics";

interface IProps {
  isOpen: boolean;
  teamId: string;
}

const DeleteTeam: FC<IProps> = props => {
  const { isOpen, teamId } = props;
  const intl = useIntl();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  // Delete a Team
  const { mutateAsync: deleteTeamTeamId } = useDeleteV3GfwTeamsTeamId();

  const close = () => {
    history.push(`/teams/${teamId}`);
  };

  const deleteTeam = async () => {
    setIsDeleting(true);
    try {
      await deleteTeamTeamId({ headers: httpAuthHeader, pathParams: { teamId } });

      // Ensure the Team Listing and Team Details caches are invalidated, forcing a re-fetched
      await invalidateGetUserTeams();

      history.push("/teams");
      toastr.success(intl.formatMessage({ id: "teams.delete.success" }), "");
      fireGAEvent({
        category: "Teams",
        action: TeamActions.teamManagement,
        label: TeamLabels.DeletedTeam
      });
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "teams.delete.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
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
      <p>
        <FormattedMessage id="teams.delete.body" />
      </p>
    </Modal>
  );
};

export default DeleteTeam;
