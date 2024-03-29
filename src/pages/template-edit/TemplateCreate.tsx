import Hero from "components/layouts/Hero/Hero";
import { fireGAEvent } from "helpers/analytics";
import { useAccessToken } from "hooks/useAccessToken";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import TemplateForm, { FormFields } from "./components/TemplateForm";
import { TEMPLATE, QUESTION } from "constants/templates";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { usePostV3GfwTemplates } from "generated/core/coreComponents";
import useUrlQuery from "hooks/useUrlQuery";
import { getFormBody } from "./TemplateEdit";

const TemplateCreate = () => {
  const { httpAuthHeader } = useAccessToken();
  const history = useHistory();
  const locale: string = useSelector((state: RootState) => state.app.locale);
  const { mutateAsync } = usePostV3GfwTemplates();
  const urlQuery = useUrlQuery();
  const backTo = useMemo(() => urlQuery.get("backTo"), [urlQuery]);
  const backLink = backTo || "/templates";

  const defaultTemplate = useMemo(() => {
    return {
      ...TEMPLATE,
      name: {
        [locale]: ""
      },
      languages: [locale],
      defaultLanguage: locale,
      questions: [
        {
          ...QUESTION,
          order: 0,
          label: {
            [locale]: ""
          },
          name: `question-1`
        }
      ]
    };
  }, [locale]);

  const handleSubmit = async (data: FormFields) => {
    // @ts-ignore  - incorrect typings
    const resp = await mutateAsync({ body: { ...getFormBody(data), areaIds: data.areas }, headers: httpAuthHeader });

    fireGAEvent({
      category: "Templates",
      action: "create_template",
      label: "completed_template"
    });

    history.push(backTo ? backTo : `/templates/${resp.data?.id}`);
  };

  return (
    <section className="relative">
      <Hero title="templates.create" backLink={{ name: "template.back", to: backLink }} />
      <TemplateForm
        backLink="/templates"
        // @ts-ignore - incorrect typings
        template={{
          ...defaultTemplate,
          areas: []
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default TemplateCreate;
