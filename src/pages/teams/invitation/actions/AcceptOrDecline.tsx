import {
  PatchV3GfwTeamsTeamIdUsersUserIdAcceptError,
  PatchV3GfwTeamsTeamIdUsersUserIdDeclineError,
  usePatchV3GfwTeamsTeamIdUsersUserIdAccept,
  usePatchV3GfwTeamsTeamIdUsersUserIdDecline
} from "generated/core/coreComponents";
import useGetTeamInvites from "hooks/querys/teams/useGetTeamInvites";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { Redirect, useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { FormattedMessage, useIntl } from "react-intl";

const CONFIG = {
  accept: {
    title: "teams.invitation.accept.modal.title",
    body: "teams.invitation.accept.modal.body",
    confirmBtn: "teams.invitation.accept",
    cancelBtn: "common.cancel",
    successMessage: "teams.invitation.accept.modal.success",
    errorMessage: "teams.invitation.accept.modal.error"
  },
  acceptAll: {
    title: "teams.invitation.acceptAll.modal.title",
    body: "teams.invitation.acceptAll.modal.body",
    confirmBtn: "teams.invitation.acceptAll",
    cancelBtn: "common.cancel",
    successMessage: "teams.invitation.acceptAll.modal.success",
    errorMessage: "teams.invitation.acceptAll.modal.error"
  },
  decline: {
    title: "teams.invitation.decline.modal.title",
    body: "teams.invitation.decline.modal.body",
    confirmBtn: "teams.invitation.decline",
    cancelBtn: "common.cancel",
    successMessage: "teams.invitation.decline.modal.success",
    errorMessage: "teams.invitation.decline.modal.error"
  }
};

export interface IProps {
  isOpen: boolean;
  actionType: "accept" | "decline";
  teamId: string;
}

const RemoveTeamMemberModal: FC<IProps> = props => {
  const { isOpen, actionType, teamId } = props;
  const history = useHistory();
  const intl = useIntl();
  const userId = useGetUserId();
  const [isLoading, setIsLoading] = useState(false);

  /* Queries */
  const { httpAuthHeader } = useAccessToken();
  // Get all the User's Team Invites
  const { data: userTeamInvites, isLoading: isTeamInvitesLoading } = useGetTeamInvites();

  /* Mutations */
  // Accept Team Invitation
  const { mutateAsync: acceptTeamInvite } = usePatchV3GfwTeamsTeamIdUsersUserIdAccept();
  const { mutateAsync: declineTeamInvite } = usePatchV3GfwTeamsTeamIdUsersUserIdDecline();

  const close = useCallback(() => {
    history.push(`/teams/invitations`);
  }, [history]);

  useEffect(() => {
    // Close the modal if teamId isn't present in the team invites
    // Or the user has no invites when they're trying to "accept all"
    if (
      isOpen &&
      !isTeamInvitesLoading &&
      ((userTeamInvites?.length && teamId !== "all" && !userTeamInvites.find(invite => invite.id === teamId)) ||
        !userTeamInvites?.length)
    ) {
      toastr.warning(intl.formatMessage({ id: "teams.invitation.invalid" }), "");
      close();
    }
  }, [close, intl, isOpen, isTeamInvitesLoading, teamId, userTeamInvites]);

  const config = teamId === "all" && actionType === "accept" ? CONFIG["acceptAll"] : CONFIG[actionType];

  const handleConfirm = async () => {
    if (!userTeamInvites) return; // Should never get here

    setIsLoading(true);
    try {
      if (actionType === "accept" && teamId === "all") {
        for (let i = 0; i < userTeamInvites.length; i++) {
          await acceptTeamInvite({ headers: httpAuthHeader, pathParams: { teamId: userTeamInvites[i].id!, userId } });
        }
      } else if (actionType === "accept") {
        await acceptTeamInvite({ headers: httpAuthHeader, pathParams: { teamId, userId } });
      } else if (actionType === "decline") {
        await declineTeamInvite({ headers: httpAuthHeader, pathParams: { teamId, userId } });
      }

      close();
      toastr.success(intl.formatMessage({ id: config.successMessage }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as
        | PatchV3GfwTeamsTeamIdUsersUserIdAcceptError
        | PatchV3GfwTeamsTeamIdUsersUserIdDeclineError;
      toastr.error(
        intl.formatMessage({ id: config.errorMessage }),
        typeof error.payload === "string" ? "" : error.payload.message!
      );
      console.error(e);
    }
    setIsLoading(false);
  };

  return (isOpen && actionType !== "accept" && actionType !== "decline") ||
    (actionType === "decline" && teamId === "all") ? (
    <Redirect to="/teams/invitations" />
  ) : (
    <Modal
      isOpen={isOpen}
      dismissible={false}
      title={config.title}
      onClose={close}
      actions={[
        { name: config.confirmBtn, onClick: handleConfirm },
        { name: config.cancelBtn, variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isLoading || isTeamInvitesLoading} />
      <p>
        <FormattedMessage id={config.body} />
      </p>
    </Modal>
  );
};

export default RemoveTeamMemberModal;
