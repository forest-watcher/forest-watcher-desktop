import Input from "components/ui/Form/Input";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { FC, useEffect, useState } from "react";
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
import Icon from "components/extensive/Icon";
import yup from "configureYup";
import { yupResolver } from "@hookform/resolvers/yup";
import { unique } from "helpers/utils";

export interface FormFields extends Omit<TemplateModel, "areas"> {
  areas: string[];
}

interface IParams {
  template?: FormFields;
  assignedAreas?: string[];
  backLink?: string;
  onSubmit: (data: FormFields) => void;
}

const labelValidationFunc = yup.lazy(value => {
  const newEntries = Object.keys(value).reduce(
    (acc, val) => ({
      ...acc,
      [val]: yup.string().required()
    }),
    {}
  );

  return yup.object().shape(newEntries);
});

const labelArrValidationFunc = yup.lazy(value => {
  const newEntries = Object.keys(value).reduce(
    (acc, val) => ({
      ...acc,
      [val]: yup
        .array(
          yup.object().shape({
            label: yup.string().required()
          })
        )
        .min(1)
    }),
    {}
  );

  return yup.object().shape(newEntries);
});

const questionValidationFunc = yup.lazy(value => {
  let moreInfoValidation = yup.array().notRequired();

  if (value.childQuestions?.length > 0) {
    moreInfoValidation = yup.array(
      yup.object().shape({
        label: labelValidationFunc
      })
    );
  }

  const defaultShape = {
    label: labelValidationFunc,
    childQuestions: moreInfoValidation
  };

  if (value.type === "blob") {
    return yup.object().shape({
      ...defaultShape,
      maxImageCount: yup.number().min(1).max(10).required()
    });
  }

  if (value.type === "radio" || value.type === "select") {
    return yup.object().shape({
      ...defaultShape,
      values: labelArrValidationFunc
    });
  }

  return yup.object().shape(defaultShape);
});

const templateSchema = yup
  .object()
  .shape({
    name: labelValidationFunc,
    questions: yup.array(questionValidationFunc)
  })
  .required();

const TemplateForm: FC<IParams> = ({ template, backLink = "", onSubmit }) => {
  const intl = useIntl();
  const formHook = useForm<FormFields>({ defaultValues: template, resolver: yupResolver(templateSchema) });
  const { httpAuthHeader } = useAccessToken();
  const { data: areasData } = useGetV3GfwAreasUser({ headers: httpAuthHeader });
  const [previousDefaultLang, setPreviousDefaultLang] = useState(template?.defaultLanguage || "en");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { isDirty, isSubmitting, errors }
  } = formHook;

  const defaultLanguage = useWatch({ control, name: "defaultLanguage" });
  const name = useWatch({ control, name: "name" });

  useEffect(() => {
    if (defaultLanguage) {
      const newLangs = [defaultLanguage];
      setValue("languages", newLangs, { shouldDirty: true });

      const newName: any = {};

      newName[defaultLanguage as keyof typeof name] = name?.[previousDefaultLang as keyof typeof name];

      if (!name?.[defaultLanguage as keyof typeof name]) {
        //@ts-ignore
        setValue(`name.${defaultLanguage}`, "", { shouldDirty: true });
      }

      setValue(`name`, newName, { shouldDirty: true });

      setPreviousDefaultLang(defaultLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLanguage]);

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
              registered={register(`name.${defaultLanguage}`)}
              htmlInputProps={{
                type: "text",
                label: intl.formatMessage({ id: "template.edit.name" }),
                placeholder: intl.formatMessage({ id: "template.edit.name.placeholder" })
              }}
              key={defaultLanguage}
              alternateLabelStyle
              largeLabel
              // @ts-ignore
              error={errors.name && errors.name[`${defaultLanguage}`]}
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
              disabled={!areasData || !areasData?.data || areasData?.data?.length === 0}
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
        <section className="bg-neutral-400 pt-15 pb-36 px-2.5">
          <div className="max-w-row mx-auto">
            <h2 className="font-base text-4xl font-light text-neutral-700 mb-10">
              <FormattedMessage id="template.questions" />
            </h2>
            <TemplateQuestions onQuestionDelete={handleQuestionDelete} />
          </div>
        </section>
        {/** Footer Section */}
        <section className="bg-neutral-300 py-5 px-2.5 fixed bottom-0 left-0 right-0">
          <div className="max-w-row mx-auto flex flex-wrap w-full justify-between align-middle gap-3">
            <Button variant="secondary" onClick={handleAddQuestion} className="flex gap-[10px] items-center">
              <Icon size={14} name="PlusForButton" className="relative top-[-1px]" />
              <FormattedMessage id="templates.addQuestion" />
            </Button>
            <div className="flex align-middle gap-10 flex-wrap">
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
                  disabled={!isDirty || isSubmitting}
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
