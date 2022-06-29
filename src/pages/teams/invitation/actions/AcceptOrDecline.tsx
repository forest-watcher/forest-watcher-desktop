import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { Redirect, useHistory } from "react-router-dom";
import { teamService } from "services/teams";
import { getMyTeamInvites } from "modules/gfwTeams";
import { toastr } from "react-redux-toastr";
import { TErrorResponse } from "constants/api";
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
  const dispatch = useAppDispatch();
  const { myInvites, myInvitesFetched, numOfActiveFetches } = useAppSelector(state => state.gfwTeams);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  const close = useCallback(() => {
    history.push(`/teams/invitations`);
  }, [history]);

  // Close modal with teamId or actionType is invalid

  useEffect(() => {
    // Close the modal if teamId isn't present in the team invites
    // Or the user has no invites when they're trying to "accept all"
    if (
      isOpen &&
      myInvitesFetched &&
      ((myInvites.length && teamId !== "all" && !myInvites.find(invite => invite.id === teamId)) || !myInvites.length)
    ) {
      toastr.warning(intl.formatMessage({ id: "teams.invitation.invalid" }), "");
      close();
    }
  }, [actionType, close, history, intl, isOpen, myInvites, myInvitesFetched, teamId]);

  const config = teamId === "all" && actionType === "accept" ? CONFIG["acceptAll"] : CONFIG[actionType];

  const acceptTeamInvite = async () => {
    setIsLoading(true);
    try {
      if (actionType === "accept" && teamId === "all") {
        for (let i = 0; i < myInvites.length; i++) {
          await teamService.acceptTeamInvite(myInvites[i].id);
        }
      } else if (actionType === "accept") {
        await teamService.acceptTeamInvite(teamId);
      } else if (actionType === "decline") {
        await teamService.declineTeamInvite(teamId);
      }

      close();
      dispatch(getMyTeamInvites());
      toastr.success(intl.formatMessage({ id: config.successMessage }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: config.errorMessage }),
        error?.errors?.length ? error.errors[0].detail : ""
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
        { name: config.confirmBtn, onClick: acceptTeamInvite },
        { name: config.cancelBtn, variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isLoading || numOfActiveFetches > 0} />
      <p>
        <FormattedMessage id={config.body} />
      </p>
    </Modal>
  );
};

export default RemoveTeamMemberModal;
