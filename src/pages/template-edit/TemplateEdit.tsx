import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import {
  useGetV3GfwTemplatesTemplateId,
  usePatchV3GfwTemplatesTemplateId,
  usePatchV3TemplatesTemplateIdStatus
} from "generated/core/coreComponents";
import { TemplateResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { useHistory, useParams } from "react-router-dom";
import TemplateForm, { FormFields } from "./components/TemplateForm";

interface TemplateResponseWithData {
  data?: TemplateResponse;
}

const TemplateEdit = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();
  const history = useHistory();

  const { data, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const { mutateAsync: mutateStatus } = usePatchV3TemplatesTemplateIdStatus();

  const { mutateAsync } = usePatchV3GfwTemplatesTemplateId();

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  const handleSubmit = async (data: FormFields) => {
    data.questions?.forEach(question => {
      if (question?.values && Object.keys(question.values).length === 0) {
        // @ts-ignore
        delete question.values;
      }
    });

    const resp = await mutateAsync({ body: data, pathParams: { templateId }, headers: httpAuthHeader });

    if (data.status !== template.data?.attributes?.status) {
      const status = data.status as "published" | "unpublished";
      await mutateStatus({
        body: { status: status },
        // @ts-ignore
        pathParams: { templateId: resp.data.id },
        headers: httpAuthHeader
      });
    }

    // @ts-ignore
    history.push(`/templates/${resp.data.id}`);
  };

  return (
    <section className="relative">
      <Hero title="template.edit.title" backLink={{ name: "template.edit.back", to: `/templates/${templateId}` }} />
      <LoadingWrapper loading={templateLoading}>
        {template?.data?.attributes && (
          <TemplateForm
            backLink={`/templates/${templateId}`}
            template={{
              ...template.data.attributes,
              areas: template.data.attributes.areas?.map(area => area.id || "") || []
            }}
            onSubmit={handleSubmit}
          />
        )}
      </LoadingWrapper>
    </section>
  );
};

export default TemplateEdit;
