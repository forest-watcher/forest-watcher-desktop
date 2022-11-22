import LoadingWrapper from "components/extensive/LoadingWrapper";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Hero from "components/layouts/Hero/Hero";
import { useGetV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { TemplateResponse } from "generated/core/coreResponses";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import TemplateAreas from "./components/TemplateAreas";
import TemplateDetails from "./components/TemplateDetails";
import TemplateQuestions from "./components/TemplateQuestions";

interface TemplateResponseWithData {
  data?: TemplateResponse;
}

const TemplateDetail = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();
  const { url } = useRouteMatch();
  const userId = useGetUserId();

  const { data, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  const isMyTemplate = useMemo(() => {
    return template?.data?.attributes?.user === userId;
  }, [template?.data?.attributes?.user, userId]);

  return (
    <section className="relative">
      <Hero
        title="template.details"
        backLink={{ name: "template.back", to: "/templates" }}
        actions={
          isMyTemplate ? (
            <Link to={`${url}/edit`} className="c-button c-button--primary">
              <FormattedMessage id="common.edit" />
            </Link>
          ) : (
            <></>
          )
        }
      />
      <LoadingWrapper loading={templateLoading}>
        <TemplateDetails template={template?.data?.attributes} />
        <OptionalWrapper data={!template?.data?.attributes?.public}>
          <TemplateAreas areas={template?.data?.attributes?.areas || []} />
        </OptionalWrapper>
        <TemplateQuestions
          questions={template?.data?.attributes?.questions || []}
          defaultLanguage={template?.data?.attributes?.defaultLanguage}
        />
      </LoadingWrapper>
    </section>
  );
};

export default TemplateDetail;
