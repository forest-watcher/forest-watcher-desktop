import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import { useGetV3GfwTemplatesTemplateId, usePatchV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { TemplateResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";
import TemplateForm, { FormFields } from "./components/TemplateForm";

interface TemplateResponseWithData {
  data?: TemplateResponse;
}

const TemplateEdit = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();

  const { data, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const { mutate } = usePatchV3GfwTemplatesTemplateId();

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  const handleSubmit = (data: FormFields) => {
    console.log(data);
    mutate({ body: data, pathParams: { templateId }, headers: httpAuthHeader });
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
