import Input from "components/ui/Form/Input";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { FC } from "react";
import { TemplateModel } from "generated/core/coreSchemas";
import { LOCALES_MAPPED_TO_SELECT } from "constants/locales";
import Select from "components/ui/Form/Select";

interface FormFields extends TemplateModel {}

interface IParams {
  template?: TemplateModel;
  assignedAreas?: string[];
}

const TemplateForm: FC<IParams> = ({ template = {}, assignedAreas = [] }) => {
  const intl = useIntl();
  const formHook = useForm<FormFields>({ defaultValues: template });
  const { register, watch } = formHook;

  return (
    <form>
      {/** Top level data */}
      <section className="bg-neutral-300 pt-15 pb-20 px-2.5">
        <div className="max-w-row mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <Input
            id="name"
            // @ts-ignore - todo how to figure out variable register
            registered={register(`name.${template.defaultLanguage}`)}
            htmlInputProps={{
              type: "text",
              label: intl.formatMessage({ id: "template.edit.name" }),
              placeholder: intl.formatMessage({ id: "template.edit.name.placeholder" }),
              alternateLabelStyle: true,
              largeLabel: true
            }}
            key={template.defaultLanguage}
          />
          <Select
            id="areas"
            formHook={formHook}
            registered={register("areas")}
            selectProps={{
              placeholder: intl.formatMessage({ id: "template.edit.areas.placeholder" }),
              options: [],
              label: intl.formatMessage({ id: "template.edit.areas" }),
              alternateLabelStyle: true,
              largeLabel: true
            }}
          />
          <Select
            id="defaultLang"
            formHook={formHook}
            registered={register("defaultLanguage")}
            selectProps={{
              placeholder: intl.formatMessage({ id: "template.edit.defaultLanguage.placeholder" }),
              options: LOCALES_MAPPED_TO_SELECT,
              label: intl.formatMessage({ id: "template.edit.defaultLanguage" }),
              alternateLabelStyle: true,
              largeLabel: true
            }}
          />
        </div>
      </section>
      {/** Questions */}
      <section className="bg-neutral-400 pt-15 pb-20 px-2.5">
        <div className="max-w-row mx-auto"></div>
      </section>
      {/** Footer Section */}
      <section className="bg-neutral-300 py-10 px-2.5">
        <div className="max-w-row mx-auto"></div>
      </section>
      {/* <TemplateDetails template={template?.data?.attributes} />
        <TemplateQuestions
          questions={template?.data?.attributes?.questions || []}
          defaultLanguage={template?.data?.attributes?.defaultLanguage}
        /> */}
    </form>
  );
};

export default TemplateForm;
