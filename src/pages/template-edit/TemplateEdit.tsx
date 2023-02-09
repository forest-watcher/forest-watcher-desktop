import LoadingWrapper from "components/extensive/LoadingWrapper";
import Hero from "components/layouts/Hero/Hero";
import {
  useGetV3GfwTemplatesTemplateId,
  usePatchV3GfwTemplatesTemplateId,
  usePatchV3TemplatesTemplateIdStatus
} from "generated/core/coreComponents";
import { ChildQuestionModel } from "generated/core/coreSchemas";
import { useInvalidateGetTemplates } from "hooks/querys/templates/useGetTemplates";
import { useAccessToken } from "hooks/useAccessToken";
import { useHistory, useParams } from "react-router-dom";
import TemplateForm, { FormFields } from "./components/TemplateForm";

const AUDIO_CHILD_QUESTION = {
  type: "text",
  label: {
    en: "Description"
  },
  name: "question-1-description"
};

export const getFormBody = (data: FormFields) => {
  const newData = { ...data };
  data.questions?.forEach(question => {
    if (question?.values && Object.keys(question.values).length === 0) {
      // @ts-ignore
      delete question.values;
    }

    if (question.type === "audio") {
      const currentChild = question.childQuestions || ([] as ChildQuestionModel[]);
      // @ts-ignore
      const hasAudioIndex = currentChild?.findIndex?.((item: any) => item?.name?.includes?.("-description"));
      // @ts-ignore
      if (currentChild.length === 0) {
        const label = AUDIO_CHILD_QUESTION.label;
        label[data.defaultLanguage as keyof typeof label] = "Description";

        const newAudioQuestion = { ...AUDIO_CHILD_QUESTION, label, name: `${question.name}-description` };
        // @ts-ignore
        question.childQuestions = [newAudioQuestion];
      }

      // @ts-ignore
      if (currentChild?.[hasAudioIndex]) {
        // @ts-ignore
        const q = currentChild[hasAudioIndex];

        const label = q.label;
        label[data.defaultLanguage as keyof typeof label] = "Description";

        // @ts-ignore
        currentChild[hasAudioIndex] = {
          ...q,
          label
        };
      }
    }
  });
  return newData;
};

const TemplateEdit = () => {
  const { httpAuthHeader } = useAccessToken();
  const { templateId } = useParams<{ templateId: string }>();
  const history = useHistory();
  const invalidateGetTemplates = useInvalidateGetTemplates();

  const { data: template, isLoading: templateLoading } = useGetV3GfwTemplatesTemplateId({
    headers: httpAuthHeader,
    pathParams: { templateId }
  });

  const { mutateAsync: mutateStatus } = usePatchV3TemplatesTemplateIdStatus();

  const { mutateAsync } = usePatchV3GfwTemplatesTemplateId();

  const handleSubmit = async (data: FormFields) => {
    console.log(data);
    const resp = await mutateAsync({
      // @ts-ignore
      body: { ...getFormBody(data), areaIds: data.areas },
      pathParams: { templateId },
      headers: httpAuthHeader
    });

    if (data.status !== template?.data?.attributes?.status) {
      const status = data.status as "published" | "unpublished";
      await mutateStatus({
        body: { status: status },
        // @ts-ignore
        pathParams: { templateId: resp.data.id },
        headers: httpAuthHeader
      });
    }

    await invalidateGetTemplates();

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
