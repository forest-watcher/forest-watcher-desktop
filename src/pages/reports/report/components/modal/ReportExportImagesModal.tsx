import LoadingWrapper from "components/extensive/LoadingWrapper";
import Select from "components/ui/Form/Select";
import Modal from "components/ui/Modal/Modal";
import { REPORT_EXPORT_IMAGES_TYPES } from "constants/export";
import useReportImageExport from "hooks/querys/exports/useReportImageExport";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

export type ReportExportImagesModalFormData = {
  fileType?: string;
};

type ReportExportImagesModalProps = {
  onClose: () => void;
};

const ReportExportImagesModal = ({ onClose }: ReportExportImagesModalProps) => {
  const { formatMessage } = useIntl();
  const { answerId } = useParams<{ answerId: string }>();
  const formHook = useForm<ReportExportImagesModalFormData>();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = formHook;

  const { mutateAsync: exportImages, isLoading } = useReportImageExport();

  const handleSave = async (data: ReportExportImagesModalFormData) => {
    const value = await exportImages({ values: data, params: { id: answerId } });
    if (value.data) {
      window.open(value.data, "_blank");
      onClose();
    }

    return value.data;
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={formatMessage({ id: "reports.detail.exportImages" })}
      className="c-modal-form"
      actions={[
        { name: "common.download", onClick: handleSubmit(handleSave) },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <LoadingWrapper loading={isLoading}>
        <Select
          id="fileType"
          selectProps={{
            label: formatMessage({ id: "export.fileType" }),
            placeholder: formatMessage({ id: "export.selectFileType" }),
            options: REPORT_EXPORT_IMAGES_TYPES
          }}
          error={errors.fileType}
          registered={register("fileType", { required: { value: true, message: "Field is required." } })}
          formHook={formHook}
        />
      </LoadingWrapper>
    </Modal>
  );
};

export default ReportExportImagesModal;
