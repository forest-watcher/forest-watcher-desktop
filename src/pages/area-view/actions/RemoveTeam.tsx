import { useInvalidateGetAreaById } from "hooks/querys/areas/useGetAreaById";
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
import { getAreas } from "modules/areas";

type TParams = TAreaDetailParams & {
  teamId: string;
};

interface IProps {}

const RemoveTeamModal: FC<IProps> = props => {
  const { teamId, areaId } = useParams<TParams>();
  const history = useHistory();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const invalidateGetAreaById = useInvalidateGetAreaById();

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const removeTeam = async () => {
    setIsRemoving(true);
    try {
      await areaService.unassignTeamFromArea(areaId, teamId);
      dispatch(getAreas());
      await invalidateGetAreaById(areaId);
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
      isOpen
      dismissible={false}
      title={"areas.details.teams.remove.title"}
      onClose={onClose}
      actions={[
        { name: "common.confirm", onClick: removeTeam },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <Loader isLoading={isRemoving} />
      <p>
        <FormattedMessage id="areas.details.teams.remove.body" />
      </p>
    </Modal>
  );
};

export default RemoveTeamModal;
