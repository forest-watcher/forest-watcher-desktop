import LoadingWrapper from "components/extensive/LoadingWrapper";
import { useGetV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import { useParams } from "react-router-dom";
import TemplateAreas from "./components/TemplateAreas";
import TemplateDetails from "./components/TemplateDetails";
import TemplateHeader from "./components/TemplateHeader";
import TemplateQuestions from "./components/TemplateQuestions";

const Template = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();

  const { data: templateData, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  return (
    <section>
      <TemplateHeader />
      <LoadingWrapper loading={templateLoading}>
        <TemplateDetails
          // @ts-expect-error
          template={templateData?.data?.attributes}
        />
        <TemplateAreas
          // @ts-expect-error
          areas={templateData?.data?.attributes.areas}
        />
        <TemplateQuestions
          // @ts-expect-error
          questions={templateData?.data?.attributes?.questions}
          // @ts-expect-error
          defaultLanguage={templateData?.data?.attributes?.defaultLanguage}
        />
      </LoadingWrapper>
    </section>
  );
};

export default Template;
