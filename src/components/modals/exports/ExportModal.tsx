import LoadingWrapper from "components/extensive/LoadingWrapper";
import { FC, useMemo, useRef, useState } from "react";
import FormModal from "components/modals/FormModal";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { IProps as IModalProps } from "components/modals/FormModal";
import { useIntl } from "react-intl";
import { UnpackNestedValue } from "react-hook-form";
import { download } from "helpers/exports";
import LinkPreview from "components/ui/LinkPreview/LinkPreview";
import { bitlyService } from "services/bitly";

export type TExportForm = {
  fileType: string;
  fields: string[];
  downloadMethod: "download" | "email" | "link";
  email?: string;
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

const exportSchemaWithEmail = yup
  .object()
  .shape({
    fileType: yup.string().required(),
    fields: yup.array(),
    downloadMethod: yup.string().required(),
    email: yup.string().email().required()
  })
  .required();

const ExportModal: FC<IProps> = ({ onClose, onSave, isOpen, fileTypes, fields, defaultSelectedFields }) => {
  const intl = useIntl();
  const [downloadMethod, setDownloadMethod] = useState();
  const [isReportURLLoading, setIsReportURLLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState<string>();
  const formModalRef = useRef<HTMLDivElement>(null);
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

    if (downloadMethod === "email") {
      toReturn.push({
        id: "email",
        htmlInputProps: {
          label: intl.formatMessage({ id: "export.emailTo" }),
          type: "email",
          placeholder: ""
        },
        registerProps: {
          name: "email"
        },
        formatErrors: errors => errors.email
      });
    }

    return toReturn;
  }, [fields, fileTypes, intl, downloadMethod]);

  const handleSave = async (resp: UnpackNestedValue<TExportForm>) => {
    if (resp.downloadMethod === "link") {
      onClose?.();

      return;
    }

    const saveResp = await onSave(resp);
    if (saveResp && resp.downloadMethod === "download") {
      download(saveResp);
    }

    onClose?.();
  };

  const generateShortenedLink = async (resp: UnpackNestedValue<TExportForm>) => {
    setIsReportURLLoading(true);
    const saveResp = await onSave(resp);
    if (saveResp) {
      const shorten = await bitlyService.shorten(saveResp);
      setReportUrl(shorten.link);
      setIsReportURLLoading(false);
    }
  };

  return (
    <FormModal<TExportForm>
      isOpen={isOpen}
      modalRef={formModalRef}
      onClose={onClose}
      onSave={handleSave}
      modalTitle="export.title"
      submitBtnName="common.done"
      hideUnsavedChangesModal
      useFormProps={{
        mode: downloadMethod === "link" ? "onChange" : "onSubmit",
        resolver: yupResolver(downloadMethod === "email" ? exportSchemaWithEmail : exportSchema),
        defaultValues: { downloadMethod: "download", fields: defaultSelectedFields || [] }
      }}
      inputs={inputs}
      watch={["downloadMethod", "fields", "fileType"]}
      onChange={async (changes, formHook) => {
        const values = formHook.getValues();

        setDownloadMethod(changes[0]);

        if (changes[0] === "link" && !values.fileType) {
          formHook.setError("fileType", {
            type: "custom",
            message: intl.formatMessage({ id: "errors.mixed.required" })
          });

          formModalRef?.current?.scrollTo({ top: 0 });
        }

        if (changes[0] === "link" && !!values.fileType && (await exportSchema.isValid(values))) {
          generateShortenedLink(values);
        }
      }}
    >
      <LoadingWrapper loading={isReportURLLoading}>
        {downloadMethod === "link" && reportUrl && (
          <LinkPreview btnCaption={intl.formatMessage({ id: "export.copyLink" })} link={reportUrl} className="">
            {reportUrl}
          </LinkPreview>
        )}
      </LoadingWrapper>
    </FormModal>
  );
};

export default ExportModal;
