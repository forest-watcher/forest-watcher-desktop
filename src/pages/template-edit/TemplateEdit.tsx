import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import {
  useGetV3GfwTemplatesTemplateId,
  usePatchV3GfwTemplatesTemplateId,
  usePatchV3TemplatesTemplateIdStatus
} from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useHistory, useParams } from "react-router-dom";
import TemplateForm, { FormFields } from "./components/TemplateForm";

const TemplateEdit = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();
  const history = useHistory();

  const { data: template, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const { mutateAsync: mutateStatus } = usePatchV3TemplatesTemplateIdStatus();

  const { mutateAsync } = usePatchV3GfwTemplatesTemplateId();

  const handleSubmit = async (data: FormFields) => {
    data.questions?.forEach(question => {
      if (question?.values && Object.keys(question.values).length === 0) {
        // @ts-ignore
        delete question.values;
      }
    });

    const resp = await mutateAsync({ body: data, pathParams: { templateId }, headers: httpAuthHeader });

    if (data.status !== template?.data?.attributes?.status) {
      const status = data.status as "published" | "unpublished";
      await mutateStatus({
        body: { status: status },
        // @ts-ignore
        pathParams: { templateId: resp.data.id },
        headers: httpAuthHeader
      });
    }

    history.push(`/templates/${resp.data?.id}`);
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
