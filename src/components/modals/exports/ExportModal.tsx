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
  isOpen: IModalProps<TExportForm>["isOpen"];
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

const ExportModal: FC<IProps> = ({ onClose, onSave, isOpen, fileTypes, fields }) => {
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
        radioGroupProps: {
          label: "export.downloadMethod",
          options: [
            {
              name: "export.downloadMethods.download",
              value: "download"
            },
            {
              name: "export.downloadMethods.email",
              value: "email"
            },
            {
              name: "export.downloadMethods.link",
              value: "link"
            }
          ],
          value: "download",
          labelClassName: "c-input__label"
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
      isOpen={isOpen}
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
