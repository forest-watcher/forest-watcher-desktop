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
import { getAreas, getAreasInUsersTeams } from "modules/areas";

type TParams = TAreaDetailParams & {
  templateId: string;
};

interface IProps {}

const RemoveTemplateModal: FC<IProps> = props => {
  const { templateId, areaId } = useParams<TParams>();
  const history = useHistory();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  const onClose = useCallback(() => {
    history.push(`/areas/${areaId}`);
  }, [history, areaId]);

  const removeTemplate = async () => {
    setIsRemoving(true);
    try {
      await areaService.unassignTemplateFromArea(areaId, templateId);
      dispatch(getAreas(true));
      dispatch(getAreasInUsersTeams(true));
      onClose();
      toastr.success(intl.formatMessage({ id: "areas.details.templates.remove.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "areas.details.templates.remove.error" }),
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
      title={"areas.details.templates.remove.title"}
      onClose={onClose}
      actions={[
        { name: "common.confirm", onClick: removeTemplate },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <Loader isLoading={isRemoving} />
      <p>
        <FormattedMessage id="areas.details.templates.remove.body" />
      </p>
    </Modal>
  );
};

export default RemoveTemplateModal;
