import IconCard from "components/icon-card/IconCard";
import { LOCALES_LIST } from "constants/locales";
import { TemplateModel } from "generated/core/coreSchemas";
import { useIntl } from "react-intl";

type TemplateDetailsProps = {
  template?: TemplateModel;
};

const TemplateDetails = ({ template }: TemplateDetailsProps) => {
  const intl = useIntl();
  // @ts-expect-error
  const templateName = template?.name[template?.defaultLanguage];

  return (
    <section className="row column py-section">
      <h1 className="font-base text-[36px] font-light text-neutral-700 mb-10">{templateName}</h1>
      <section className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <IconCard
          iconName={"check-doc"}
          title={intl.formatMessage({ id: "template.version" })}
          text={intl.formatDate(template?.createdAt, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
          })}
        />
        <IconCard
          iconName={"translate"}
          title={intl.formatMessage({ id: "template.language" })}
          text={LOCALES_LIST.find(loc => loc.code === template?.defaultLanguage)?.name ?? ""}
        />
      </section>
    </section>
  );
};

export default TemplateDetails;
