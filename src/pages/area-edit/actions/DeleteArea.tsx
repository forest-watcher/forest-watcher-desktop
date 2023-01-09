import { FC, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory, useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { TErrorResponse } from "constants/api";
import { TParams } from "pages/area-view/AreaView";
import { useDeleteV3GfwAreasAreaId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useCoreContext } from "generated/core/coreContext";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
  onClose?: () => void;
}

const DeleteArea: FC<IProps> = props => {
  const intl = useIntl();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { areaId } = useParams<TParams>();
  const { onClose } = props;

  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync } = useDeleteV3GfwAreasAreaId();
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  const close = () => {
    onClose?.();
    history.push(`/areas/${areaId}/edit`);
  };

  const onDeleteArea = async () => {
    setIsDeleting(true);
    try {
      await mutateAsync({ pathParams: { areaId }, headers: httpAuthHeader });
      await queryClient.invalidateQueries(
        queryKeyFn({ path: "/v3/gfw/areas/userAndTeam", operationId: "getV3GfwAreasUserandteam", variables: {} })
      );
      history.push("/areas");
      toastr.success(intl.formatMessage({ id: "areas.delete.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "areas.delete.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
    }
    setIsDeleting(false);
  };

  return (
    <Modal
      isOpen
      dismissible={false}
      title="areas.deleteAreaTitle"
      onClose={close}
      actions={[
        { name: "areas.deleteArea", onClick: onDeleteArea },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isDeleting} />
      <p>
        <FormattedMessage id="areas.deleteAreaBody" />
      </p>
    </Modal>
  );
};

export default DeleteArea;
