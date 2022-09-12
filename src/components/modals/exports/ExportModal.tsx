import { FC, useMemo, useState } from "react";
import FormModal from "components/modals/FormModal";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { IProps as IModalProps } from "components/modals/FormModal";
import { useIntl } from "react-intl";
import { UnpackNestedValue } from "react-hook-form";
import { download, openMailClient } from "helpers/exports";
import LinkPreview from "components/ui/LinkPreview/LinkPreview";
import { bitlyService } from "services/bitly";

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
  defaultSelectedFields?: string[];
}

const exportSchema = yup
  .object()
  .shape({
    fileType: yup.string().required(),
    fields: yup.array(),
    downloadMethod: yup.string().required()
  })
  .required();

const ExportModal: FC<IProps> = ({ onClose, onSave, isOpen, fileTypes, fields, defaultSelectedFields }) => {
  const intl = useIntl();
  const [downloadMethod, setDownloadMethod] = useState();
  const [reportUrl, setReportUrl] = useState("");
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
        className: "u-margin-bottom-medium",
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
    if (resp.downloadMethod === "link") onClose?.();

    const saveResp = await onSave(resp);
    if (saveResp) {
      // handle action, e.g. download
      switch (resp.downloadMethod) {
        case "download":
          download(saveResp);
          break;
        case "email":
          openMailClient(intl.formatMessage({ id: "export.subject" }), saveResp);
          break;
      }
    }
    onClose?.();
  };

  const generateShortenedLink = async (resp: UnpackNestedValue<TExportForm>) => {
    setReportUrl(intl.formatMessage({ id: "export.linkLoading" }));
    const saveResp = await onSave(resp);
    if (saveResp) {
      const shorten = await bitlyService.shorten(saveResp);
      setReportUrl(shorten.link);
    }
  };

  return (
    <FormModal<TExportForm>
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      modalTitle="export.title"
      submitBtnName="common.done"
      useFormProps={{
        mode: downloadMethod === "link" ? "onChange" : "onSubmit",
        resolver: yupResolver(exportSchema),
        defaultValues: { downloadMethod: "download", fields: defaultSelectedFields || [] }
      }}
      inputs={inputs}
      watch={["downloadMethod", "fields", "fileType"]}
      onChange={async (changes, values) => {
        setDownloadMethod(changes[0]);

        if (changes[0] === "link" && (await exportSchema.isValid(values))) {
          generateShortenedLink(values);
        }
      }}
    >
      {downloadMethod === "link" && (
        <LinkPreview btnCaption={intl.formatMessage({ id: "export.copyLink" })} link={reportUrl} className="">
          {reportUrl}
        </LinkPreview>
      )}
    </FormModal>
  );
};

export default ExportModal;
