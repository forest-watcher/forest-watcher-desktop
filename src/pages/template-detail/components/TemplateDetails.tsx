import IconCard from "components/icon-card/IconCard";
import { LOCALES_LIST } from "constants/locales";
import { TemplateModel } from "generated/core/coreSchemas";
import { getTemplateDate } from "helpers/template";
import { useIntl } from "react-intl";

type TemplateDetailsProps = {
  template?: TemplateModel;
};

const TemplateDetails = ({ template }: TemplateDetailsProps) => {
  const intl = useIntl();

  if (!template) {
    return null;
  }

  const templateName: string = template.name
    ? (template.name[template?.defaultLanguage as keyof typeof template.name] as string)
    : "";

  const parsedDate = template ? getTemplateDate(template) : "";

  return (
    <section className="row column py-section">
      <h1 className="font-base text-[36px] font-light text-neutral-700 mb-10">{templateName}</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <IconCard
          iconName={"check-doc"}
          title={intl.formatMessage({ id: "template.version" })}
          text={intl.formatDate(parsedDate, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
          })}
        />
        <IconCard
          iconName={"translate"}
          title={intl.formatMessage({ id: "template.language" })}
          text={LOCALES_LIST.find(loc => loc.code === template.defaultLanguage)?.name ?? ""}
        />
      </section>
    </section>
  );
};

export default TemplateDetails;
