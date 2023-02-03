import { DeleteV3GfwArearelationsTeamsError, useDeleteV3GfwArearelationsTeams } from "generated/core/coreComponents";
import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useCallback, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TAreaDetailParams } from "../AreaView";
import { toastr } from "react-redux-toastr";
import { FormattedMessage, useIntl } from "react-intl";

type TParams = TAreaDetailParams & {
  teamId: string;
};

interface IProps {
  isOpen: boolean;
}

const RemoveAreaFromTeam: FC<IProps> = props => {
  const { teamId, areaId } = useParams<TParams>();
  const history = useHistory();
  const intl = useIntl();
  const [isRemoving, setIsRemoving] = useState(false);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  /* Mutations */
  const { httpAuthHeader } = useAccessToken();
  // Remove Area-Team Relation
  const { mutateAsync: removeAreaTeamRelation } = useDeleteV3GfwArearelationsTeams();

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const removeTeam = async () => {
    setIsRemoving(true);
    try {
      await removeAreaTeamRelation({ headers: httpAuthHeader, body: [{ areaId, teamId }] });

      // ToDo: Invalidate Areas fetches?
      await invalidateGetUserTeams();

      onClose();
      toastr.success(intl.formatMessage({ id: "areas.details.teams.remove.success" }), "");
    } catch (e: any) {
      const error = e as DeleteV3GfwArearelationsTeamsError;
      toastr.error(
        intl.formatMessage({ id: "areas.details.teams.remove.error" }),
        typeof error.payload === "string" ? "" : error.payload.message!
      );
      console.error(e);
    }
    setIsRemoving(false);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      dismissible={false}
      title={"areas.details.teams.removeArea.title"}
      onClose={onClose}
      actions={[
        { name: "common.confirm", onClick: removeTeam },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <Loader isLoading={isRemoving} />
      <p>
        <FormattedMessage id="areas.details.teams.removeArea.body" />
      </p>
    </Modal>
  );
};

export default RemoveAreaFromTeam;
