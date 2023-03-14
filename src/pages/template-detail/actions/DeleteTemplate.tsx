import { fireGAEvent } from "helpers/analytics";
import { FC } from "react";
import Modal from "components/ui/Modal/Modal";
import { useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Loader from "components/ui/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { TErrorResponse } from "../../../constants/api";
import { useDeleteV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";

interface IProps {
  templateId: string;
}

const DeleteTemplate: FC<IProps> = props => {
  const { templateId } = props;
  const intl = useIntl();
  const history = useHistory();

  const { httpAuthHeader } = useAccessToken();
  const { mutateAsync: deleteTemplate, isLoading } = useDeleteV3GfwTemplatesTemplateId();

  const handleDelete = async () => {
    try {
      await deleteTemplate({ headers: httpAuthHeader, pathParams: { templateId } });

      fireGAEvent({
        category: "Templates",
        action: "detail_view",
        label: "deleted_template"
      });

      history.push("/templates");
      toastr.success(intl.formatMessage({ id: "template.delete.success" }), "");
    } catch (e: any) {
      const error = JSON.parse(e.message) as TErrorResponse;
      toastr.error(
        intl.formatMessage({ id: "template.delete.error" }),
        error?.errors?.length ? error.errors[0].detail : ""
      );
      console.error(e);
    }
  };

  const close = () => {
    history.push(`/templates/${templateId}`);
  };

  return (
    <Modal
      isOpen
      dismissible={false}
      title="template.delete.title"
      onClose={close}
      actions={[
        { name: "template.delete.delete", onClick: handleDelete },
        { name: "common.cancel", variant: "secondary", onClick: close }
      ]}
    >
      <Loader isLoading={isLoading} />
      <p>
        <FormattedMessage id="template.delete.body" />
      </p>
    </Modal>
  );
};

export default DeleteTemplate;
