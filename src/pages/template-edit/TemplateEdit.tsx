import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import { useGetV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { TemplateResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";

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

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  return (
    <section className="relative">
      <Hero title="template.edit.title" backLink={{ name: "template.edit.back", to: `/templates/${templateId}` }} />
      <LoadingWrapper loading={templateLoading}>
        {/* <TemplateDetails template={template?.data?.attributes} />
        <TemplateQuestions
          questions={template?.data?.attributes?.questions || []}
          defaultLanguage={template?.data?.attributes?.defaultLanguage}
        /> */}
      </LoadingWrapper>
    </section>
  );
};

export default TemplateEdit;
