import { FC, useState } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory, useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { TPropsFromRedux } from "./DeleteReportContainer";
import { legacy_reportService } from "services/reports";

interface IProps extends TPropsFromRedux {}

interface IReportParams {
  reportId: string;
  id: string;
}

const DeleteReport: FC<IProps> = props => {
  const intl = useIntl();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { reportId, id } = useParams<IReportParams>();
  const { getAllReports } = props;

  const close = () => {
    history.push(`/reporting/reports`);
  };

  const onDeleteReport = async () => {
    setIsDeleting(true);
    try {
      await legacy_reportService.deleteAnswer(reportId, id);
      getAllReports();
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
