import { FC, useMemo } from "react";
import FormModal from "components/modals/FormModal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { IProps as IModalProps } from "components/modals/FormModal";
import { useIntl } from "react-intl";
import { UnpackNestedValue } from "react-hook-form";
import { copyToClipboard, download, openMailClient } from "helpers/exports";
import { toastr } from "react-redux-toastr";

export type TExportForm = {
  fileType: string;
  fields: string[];
  downloadMethod: "download" | "email" | "link";
};

interface IProps {
  onClose: IModalProps<TExportForm>["onClose"];
  onSave: (data: UnpackNestedValue<TExportForm>) => Promise<string | void>;
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
    const toReturn: IModalProps<TExportForm>["inputs"] = [
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

    if (fields.length > 0) {
      toReturn.splice(1, 0, {
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
      });
    }

    return toReturn;
  }, [fields, fileTypes, intl]);

  const handleSave = async (resp: UnpackNestedValue<TExportForm>) => {
    const saveResp = await onSave(resp);
    if (saveResp) {
      // handle action, e.g. download
      switch (resp.downloadMethod) {
        case "download":
          download(saveResp);
          break;
        case "link":
          await copyToClipboard(saveResp);
          toastr.success(intl.formatMessage({ id: "export.link.success" }), "");
          break;
        case "email":
          openMailClient(intl.formatMessage({ id: "export.subject" }), saveResp);
      }
    }
  };

  return (
    <FormModal<TExportForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      modalTitle="export.title"
      submitBtnName="common.done"
      useFormProps={{ resolver: yupResolver(exportSchema), defaultValues: { downloadMethod: "download" } }}
      inputs={inputs}
    />
  );
};

export default ExportModal;
