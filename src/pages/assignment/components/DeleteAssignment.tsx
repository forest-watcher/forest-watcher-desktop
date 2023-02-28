import { fireGAEvent } from "helpers/analytics";
import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory, useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { TParams } from "../Assignment";
import { useDeleteV3GfwAssignmentsAssignmentId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
interface IProps {
  onClose?: () => void;
}

const DeleteAssignment: FC<IProps> = props => {
  const intl = useIntl();
  const history = useHistory();
  const { id } = useParams<TParams>();
  const { onClose } = props;
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync, isLoading } = useDeleteV3GfwAssignmentsAssignmentId();

  const close = () => {
    onClose?.();
    history.push(`/assignment/${id}`);
  };

  const onDeleteAssignment = async () => {
    try {
      await mutateAsync({
        pathParams: { assignmentId: id },
        headers: httpAuthHeader
      });

      fireGAEvent({
        category: "Assignment",
        action: "detail_view",
        label: "deleted"
      });

      history.push("/reporting/assignments");
      toastr.success(intl.formatMessage({ id: "assignment.delete.success" }), "");
    } catch (e: any) {
      toastr.error(intl.formatMessage({ id: "assignment.delete.error" }), "");
      console.error(e);
    }
  };

  return (
    <Modal
      isOpen
      dismissible={false}
      title="assignment.delete.title"
      onClose={close}
      actions={[
        { name: "assignment.delete.delete", onClick: onDeleteAssignment },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isLoading} />
      <p>
        <FormattedMessage id="assignment.delete.body" />
      </p>
    </Modal>
  );
};

export default DeleteAssignment;
