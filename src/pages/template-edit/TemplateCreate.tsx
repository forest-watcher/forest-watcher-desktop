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

const TemplateCreate = () => {
  return (
    <section className="relative">
      <TemplateHeader />
      {/* <TemplateDetails template={template?.data?.attributes} />
        <TemplateQuestions
          questions={template?.data?.attributes?.questions || []}
          defaultLanguage={template?.data?.attributes?.defaultLanguage}
        /> */}
    </section>
  );
};

export default TemplateCreate;
