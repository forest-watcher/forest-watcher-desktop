import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useGetV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { TemplateResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";
import TemplateAreas from "./components/TemplateAreas";
import TemplateDetails from "./components/TemplateDetails";
import TemplateHeader from "./components/TemplateHeader";
import TemplateQuestions from "./components/TemplateQuestions";

interface TemplateResponseWithData {
  data?: TemplateResponse;
}

const TemplateDetail = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();

  const { data, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  return (
    <section className="relative">
      <TemplateHeader />
      <LoadingWrapper loading={templateLoading}>
        <TemplateDetails template={template?.data?.attributes} />
        <TemplateAreas areas={template?.data?.attributes?.areas || []} />
        <TemplateQuestions
          questions={template?.data?.attributes?.questions || []}
          defaultLanguage={template?.data?.attributes?.defaultLanguage}
        />
      </LoadingWrapper>
    </section>
  );
};

export default TemplateDetail;
