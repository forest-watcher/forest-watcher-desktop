import { useInvalidateGetUserTeams } from "hooks/querys/teams/useGetUserTeams";
import { FC, useCallback, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import Loader from "components/ui/Loader";
import { useHistory, useParams } from "react-router-dom";
import { TParams as TAreaDetailParams } from "../AreaView";
import { toastr } from "react-redux-toastr";
import { TErrorResponse } from "constants/api";
import { useAppDispatch } from "hooks/useRedux";
import { FormattedMessage, useIntl } from "react-intl";
import { areaService } from "services/area";
import { getAreasInUsersTeams } from "modules/areas";

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
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const invalidateGetUserTeams = useInvalidateGetUserTeams();

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const removeTeam = async () => {
    setIsRemoving(true);
    try {
      // ToDo: change to fw_core
      await areaService.unassignTeamFromArea(areaId, teamId);
      await invalidateGetUserTeams();
      dispatch(getAreasInUsersTeams());
      onClose();
      toastr.success(intl.formatMessage({ id: "areas.details.teams.remove.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "areas.details.teams.remove.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
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
