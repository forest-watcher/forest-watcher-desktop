import { useQueryClient } from "@tanstack/react-query";
import { useDeleteV3GfwTemplatesTemplateIdAnswersAnswerId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
import { useAccessToken } from "hooks/useAccessToken";
import { FC, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory, useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {}

interface IReportParams {
  templateId: string;
  reportAnswerId: string;
}

const DeleteReport: FC<IProps> = () => {
  const intl = useIntl();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { templateId, reportAnswerId } = useParams<IReportParams>();

  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  /**
   * Mutations - Delete a Report answer
   */
  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: deleteReportAnswer } = useDeleteV3GfwTemplatesTemplateIdAnswersAnswerId();

  const close = () => {
    history.push(`/reporting/reports`);
  };

  const onDeleteReport = async () => {
    setIsDeleting(true);
    try {
      await deleteReportAnswer({
        pathParams: { answerId: reportAnswerId, templateId },
        headers: httpAuthHeader
      });

      await queryClient.invalidateQueries(
        queryKeyFn({ path: "/v3/gfw/templates/allAnswers", operationId: "getV3GfwTemplatesAllAnswers", variables: {} })
      );

      toastr.success(intl.formatMessage({ id: "reports.delete.success" }), "");
      close();
    } catch (e: any) {
      toastr.error(intl.formatMessage({ id: "reports.delete.error" }), "");
      console.error(e);
    }
    setIsDeleting(false);
  };

  return (
    <Modal
      isOpen
      dismissible={false}
      title="reports.delete"
      onClose={close}
      actions={[
        { name: "reports.delete", onClick: onDeleteReport },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isDeleting} />
      <p>
        <FormattedMessage id="reports.delete.body" />
      </p>
    </Modal>
  );
};

export default DeleteReport;
