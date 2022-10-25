import ExportModal, { TExportForm } from "components/modals/exports/ExportModal";
import { REPORT_EXPORT_FILE_TYPES } from "constants/export";
import { UnpackNestedValue } from "react-hook-form";
import { useIntl } from "react-intl";

type ReportExportModalProps = {
  onClose: () => void;
  onSave: (data: UnpackNestedValue<TExportForm>) => Promise<string | undefined>;
};

const ReportExportModal = ({ onSave, onClose }: ReportExportModalProps) => {
  const intl = useIntl();

  return (
    <ExportModal
      onSave={onSave}
      onClose={onClose}
      isOpen
      fileTypes={REPORT_EXPORT_FILE_TYPES}
      defaultSelectedFields={[
        "fullName",
        "areaOfInterestName",
        "createdAt",
        "language",
        "userPosition",
        "reportName",
        "report",
        "templateName",
        "teamId",
        "areaOfInterest",
        "clickedPosition"
      ]}
      fields={[
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.fullName" }),
          value: "fullName"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.areaOfInterestName" }),
          value: "areaOfInterestName"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.createdAt" }),
          value: "createdAt"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.language" }),
          value: "language"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.userPosition" }),
          value: "userPosition"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.reportName" }),
          value: "reportName"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.report" }),
          value: "report"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.templateName" }),
          value: "templateName"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.teamId" }),
          value: "teamId"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.areaOfInterest" }),
          value: "areaOfInterest"
        },
        {
          label: intl.formatMessage({ id: "reports.reports.table.header.clickedPosition" }),
          value: "clickedPosition"
        }
      ]}
    />
  );
};

export default ReportExportModal;
