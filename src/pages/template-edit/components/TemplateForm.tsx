import Input from "components/ui/Form/Input";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { FC } from "react";
import { TemplateModel } from "generated/core/coreSchemas";
import { LOCALES_MAPPED_TO_SELECT } from "constants/locales";
import Select from "components/ui/Form/Select";
import { useGetV3GfwAreasUser } from "generated/core/coreComponents";
import { useAccessToken } from "hooks/useAccessToken";
import TemplateQuestions from "./TemplateQuestions";
import Button from "components/ui/Button/Button";
import { Link } from "react-router-dom";
import Toggle from "components/ui/Form/Toggle";
import { QUESTION } from "constants/templates";

export interface FormFields extends Omit<TemplateModel, "areas"> {
  areas: string[];
}

interface IParams {
  template?: FormFields;
  assignedAreas?: string[];
  backLink?: string;
  onSubmit: (data: FormFields) => void;
}

const TemplateForm: FC<IParams> = ({ template, backLink = "", onSubmit }) => {
  const intl = useIntl();
  const formHook = useForm<FormFields>({ defaultValues: template });
  const { httpAuthHeader } = useAccessToken();
  const { data: areasData } = useGetV3GfwAreasUser({ headers: httpAuthHeader });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty }
  } = formHook;

  const handleAddQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const questions = getValues("questions") || [];
    const defaultLanguage = getValues("defaultLanguage") || "en";
    e.preventDefault();
    setValue(
      "questions",
      [
        //@ts-ignore
        ...questions,
        //@ts-ignore
        {
          ...QUESTION,
          order: questions.length,
          label: {
            [defaultLanguage]: ""
          },
          name: `question-${questions.length + 1}`
        }
      ],
      { shouldDirty: true }
    );
  };

  const handleQuestionDelete = (index: number) => {
    const questions = getValues("questions") || [];

    const newQs = [...questions];
    newQs.splice(index, 1);

    newQs.forEach((q, index) => {
      q.name = `question-${index + 1}`;
      q.order = index;
    });

    setValue("questions", newQs, { shouldDirty: true });
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/** Top level data */}
        <section className="bg-neutral-300 pt-15 pb-20 px-2.5">
          <div className="max-w-row mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <Input
              id="name"
              // @ts-ignore - todo how to figure out variable register
              registered={register(`name.${template?.defaultLanguage}`)}
              htmlInputProps={{
                type: "text",
                label: intl.formatMessage({ id: "template.edit.name" }),
                placeholder: intl.formatMessage({ id: "template.edit.name.placeholder" }),
                required: true
              }}
              key={template?.defaultLanguage}
              alternateLabelStyle
              largeLabel
            />
            <Select
              id="areas"
              formHook={formHook}
              registered={register("areas")}
              isMultipleDropdown
              selectProps={{
                placeholder: intl.formatMessage({ id: "template.edit.areas.placeholder" }),
                options:
                  areasData?.data?.map(area => ({ label: area.attributes?.name || "", value: area.id || "" })) || [],
                label: intl.formatMessage({ id: "template.edit.areas" })
              }}
              alternateLabelStyle
              largeLabel
            />
            <Select
              id="defaultLang"
              formHook={formHook}
              registered={register("defaultLanguage")}
              selectProps={{
                placeholder: intl.formatMessage({ id: "template.edit.defaultLanguage.placeholder" }),
                options: LOCALES_MAPPED_TO_SELECT,
                label: intl.formatMessage({ id: "template.edit.defaultLanguage" })
              }}
              alternateLabelStyle
              largeLabel
            />
          </div>
        </section>
        {/** Questions */}
        <section className="bg-neutral-400 pt-15 pb-20 px-2.5">
          <div className="max-w-row mx-auto">
            <h2 className="font-base text-4xl font-light text-neutral-700 mb-10">
              <FormattedMessage id="template.questions" />
            </h2>
            <TemplateQuestions onQuestionDelete={handleQuestionDelete} />
          </div>
        </section>
        {/** Footer Section */}
        <section className="bg-neutral-300 py-10 px-2.5">
          <div className="max-w-row mx-auto flex w-full justify-between align-middle">
            <Button variant="secondary" onClick={handleAddQuestion}>
              <FormattedMessage id="templates.addQuestion" />
            </Button>
            <div className="flex align-middle gap-10">
              <Toggle
                id="published"
                registered={register("status")}
                getValue={(val: string) => val === "published"}
                setValue={checked => (checked ? "published" : "unpublished")}
                formHook={formHook}
                toggleProps={{ label: intl.formatMessage({ id: "template.edit.publish" }) }}
                labelClass="capitalize font-normal text-base"
              />
              <div className="flex align-middle gap-3">
                <Link className="c-button c-button--secondary" to={backLink}>
                  <FormattedMessage id="common.cancel" />
                </Link>
                <input
                  className="c-button c-button--primary"
                  type="submit"
                  value={intl.formatMessage({ id: "common.save" })}
                  disabled={!isDirty}
                />
              </div>
            </div>
          </div>
        </section>
      </form>
    </FormProvider>
  );
};

export default TemplateForm;
