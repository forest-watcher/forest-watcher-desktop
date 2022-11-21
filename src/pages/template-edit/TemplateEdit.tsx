import { useQueryClient } from "@tanstack/react-query";
import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import { useGetV3GfwTemplatesTemplateId, usePatchV3GfwTemplatesTemplateId } from "generated/core/coreComponents";
import { useCoreContext } from "generated/core/coreContext";
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
  const queryClient = useQueryClient();
  const { queryKeyFn } = useCoreContext();

  const { data, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const { mutate } = usePatchV3GfwTemplatesTemplateId({
    onSuccess: data => {
      // @ts-ignore incorrect docs . Update when docs updated
      history.push(`/templates/${data.data.id}`);
    }
  });

  const template = data as TemplateResponseWithData; // Typing is incorrect from backend response, fix here.

  const handleSubmit = async (data: FormFields) => {
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
