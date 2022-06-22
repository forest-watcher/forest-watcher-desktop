import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { IProps as IModalProps } from "components/modals/FormModal";
import { useIntl } from "react-intl";

export type TExportForm = {
  fileType: string;
  fields: string[];
  downloadMethod: "download" | "email" | "link";
};

interface IProps {
  onClose: IModalProps<TExportForm>["onClose"];
  onSave: IModalProps<TExportForm>["onSave"];
  fileTypes: {
    label: string;
    value: string;
  }[];
  fields: {
    label: string;
    value: string;
  }[];
}

const exportSchema = yup
  .object()
  .shape({
    fileType: yup.string().required(),
    fields: yup.array(),
    downloadMethod: yup.string().required()
  })
  .required();

const ExportModal: FC<IProps> = ({ onClose, onSave, fileTypes, fields }) => {
  const intl = useIntl();
  const inputs = useMemo<IModalProps<TExportForm>["inputs"]>(() => {
    return [
      {
        id: "file",
        selectProps: {
          label: intl.formatMessage({ id: "export.fileType" }),
          placeholder: intl.formatMessage({ id: "export.selectFileType" }),
          options: fileTypes
        },
        registerProps: {
          name: "fileType"
        },
        formatErrors: errors => errors.fileType
      },
      {
        id: "fields",
        toggleGroupProps: {
          label: intl.formatMessage({ id: "export.fields" }),
          options: fields,
          defaultValue: []
        },
        registerProps: {
          name: "fields"
        },
        formatErrors: errors => errors.fields
      },
      {
        id: "downloadMethod",
        selectProps: {
          label: intl.formatMessage({ id: "export.downloadMethod" }),
          placeholder: intl.formatMessage({ id: "export.selectDownloadMethod" }),
          options: [
            {
              label: "Download",
              value: "download"
            },
            {
              label: "Send Email",
              value: "email"
            },
            {
              label: "Shareable Link",
              value: "link"
            }
          ]
        },
        registerProps: {
          name: "downloadMethod"
        },
        formatErrors: errors => errors.downloadMethod
      }
    ];
  }, [fields, fileTypes, intl]);

  return (
    <FormModal<TExportForm>
      isOpen
      onClose={onClose}
      onSave={onSave}
      modalTitle="export.title"
      submitBtnName="common.done"
      useFormProps={{ resolver: yupResolver(exportSchema) }}
      inputs={inputs}
    />
  );
};

export default ExportModal;
