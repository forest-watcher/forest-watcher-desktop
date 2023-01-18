import LoadingWrapper from "components/extensive/LoadingWrapper";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Hero from "components/layouts/Hero/Hero";
import { useGetV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import useGetUserId from "hooks/useGetUserId";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import DeleteTemplate from "./actions/DeleteTemplate";
import TemplateAreas from "./components/TemplateAreas";
import TemplateDetails from "./components/TemplateDetails";
import TemplateQuestions from "./components/TemplateQuestions";

const TemplateDetail = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();
  const { path, url } = useRouteMatch();
  const userId = useGetUserId();

  const { data: template, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const isMyTemplate = useMemo(() => {
    return template?.data?.attributes?.user === userId;
  }, [template?.data?.attributes?.user, userId]);

  return (
    <>
      <section className="relative">
        <Hero
          title="template.details"
          backLink={{ name: "template.back", to: "/templates" }}
          actions={
            isMyTemplate ? (
              <>
                <Link to={`${url}/edit`} className="c-button c-button--primary">
                  <FormattedMessage id="common.edit" />
                </Link>
                {template?.data?.attributes?.status === "unpublished" && (
                  <Link to={`${url}/delete`} className="c-button c-button--secondary-light-text">
                    <FormattedMessage id="common.delete" />
                  </Link>
                )}
              </>
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
      {template?.data?.attributes?.status === "unpublished" && isMyTemplate && (
        <Switch>
          <Route path={`${path}/delete`}>
            <DeleteTemplate templateId={templateId} />
          </Route>
        </Switch>
      )}
    </>
  );
};

export default TemplateDetail;
