import LoadingWrapper from "components/extensive/LoadingWrapper";
import Select from "components/ui/Form/Select";
import Modal from "components/ui/Modal/Modal";
import { REPORT_EXPORT_IMAGES_TYPES } from "constants/export";
import { useGetV3ExportsReportsId, usePostV3ExportsReportsId } from "generated/exports/exportsComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useEffect } from "react";
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
  const { httpAuthHeader } = useAccessToken();
  const { answerId } = useParams<{ answerId: string }>();
  const formHook = useForm<ReportExportImagesModalFormData>();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = formHook;

  // Mutations - Generate ID for images to download.
  const { mutateAsync: generateId, data: generateIdData, isLoading: generateIdLoading } = usePostV3ExportsReportsId();
  // Queries - Get URL of generated images to download.
  const { data: downloadImagesData, isFetching: downloadImagesLoading } = useGetV3ExportsReportsId(
    { headers: httpAuthHeader, pathParams: { id: generateIdData?.data ?? "" } },
    { enabled: !!generateIdData?.data }
  );

  const handleSave = async (data: ReportExportImagesModalFormData) => {
    return generateId({
      headers: httpAuthHeader,
      pathParams: { id: answerId },
      body: { fileType: data.fileType }
    });
  };

  useEffect(() => {
    if (!downloadImagesData) return;
    window.open(downloadImagesData.data, "_blank");
  }, [downloadImagesData]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={"Images"}
      className="c-modal-form"
      actions={[
        { name: "Download", onClick: handleSubmit(handleSave) },
        { name: "common.cancel", variant: "secondary", onClick: onClose }
      ]}
    >
      <LoadingWrapper loading={downloadImagesLoading || generateIdLoading}>
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
