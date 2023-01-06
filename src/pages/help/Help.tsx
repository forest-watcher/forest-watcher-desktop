import Hero from "components/layouts/Hero/Hero";
import HeaderCard from "components/ui/Card/HeaderCard";
import EmptyState from "components/ui/EmptyState/EmptyState";
import Section from "components/ui/Section/Section";
import { FormattedMessage, useIntl } from "react-intl";
import HelpIcon from "assets/images/icons/Help.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "configureYup";
import TextArea from "components/ui/Form/Input/TextArea";
import Select from "components/ui/Form/Select";

const schema = yup
  .object()
  .shape({
    query: yup.string().required(),
    platform: yup.string().required(),
    queryRelate: yup.string().required()
  })
  .required();

type FormData = {
  query: string;
  platform: string;
  queryRelate: string;
};

const Help = () => {
  const intl = useIntl();
  const formHook = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    control
  } = formHook;

  const onSubmit: SubmitHandler<FormData> = data => console.log(data);

  return (
    <article className="relative">
      <Hero title={"help.title"} />

      <Section altBackground>
        <Section.Title className="mb-3">
          <FormattedMessage id="help.helpCenter.title" />
        </Section.Title>

        <Section.Text className="mb-10">
          <FormattedMessage id="help.helpCenter.subtitle" />
        </Section.Text>

        <EmptyState
          iconUrl={HelpIcon}
          title={intl.formatMessage({ id: "help.helpCenter.cta.title" })}
          text={intl.formatMessage({ id: "help.helpCenter.cta.subtitle" })}
          ctaText={intl.formatMessage({ id: "help.helpCenter.cta.link" })}
          ctaTo="https://www.globalforestwatch.org/help/"
          ctaIsExternal
          textClassName="max-w-[600px]"
        />
      </Section>

      <Section>
        <Section.Title className="mb-3">
          <FormattedMessage id="help.form.title" />
        </Section.Title>

        <Section.Text>
          <FormattedMessage id="help.form.subtitle" />
        </Section.Text>

        <HeaderCard className="my-10">
          <HeaderCard.Header>
            <HeaderCard.HeaderText>
              <FormattedMessage id="help.form.getInTouch" />
            </HeaderCard.HeaderText>
          </HeaderCard.Header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeaderCard.Content>
              <Select
                id="platform"
                formHook={formHook}
                registered={register("platform")}
                selectProps={{
                  placeholder: intl.formatMessage({ id: "help.form.platform.placeholder" }),
                  options: [
                    { label: intl.formatMessage({ id: "help.form.platform.web" }), value: "web" },
                    { label: intl.formatMessage({ id: "help.form.platform.mobile" }), value: "mobile" },
                    { label: intl.formatMessage({ id: "help.form.platform.both" }), value: "both" }
                  ],
                  label: intl.formatMessage({ id: "help.form.platform.label" })
                }}
                alternateLabelStyle
                className="mb-7"
                wrapperClassName="max-w-[334px]"
                error={errors.platform}
              />
              <Select
                id="queryRelate"
                formHook={formHook}
                registered={register("queryRelate")}
                selectProps={{
                  placeholder: intl.formatMessage({ id: "help.form.queryRelate.placeholder" }),
                  options: [
                    { label: intl.formatMessage({ id: "help.form.queryRelate.bug" }), value: "bug" },
                    { label: intl.formatMessage({ id: "help.form.queryRelate.feedback" }), value: "feedback" },
                    { label: intl.formatMessage({ id: "help.form.queryRelate.data" }), value: "data" },
                    { label: intl.formatMessage({ id: "help.form.queryRelate.general" }), value: "general" }
                  ],
                  label: intl.formatMessage({ id: "help.form.queryRelate.label" })
                }}
                alternateLabelStyle
                className="mb-7"
                wrapperClassName="max-w-[334px]"
                error={errors.queryRelate}
              />
              <TextArea
                id="query"
                label="help.form.query.label"
                placeholder="help.form.query.placeholder"
                altLabel
                control={control}
                name="query"
                error={errors.query}
              />
            </HeaderCard.Content>
            <HeaderCard.Footer>
              <input type="submit" className="c-button c-button--primary" />
            </HeaderCard.Footer>
          </form>
        </HeaderCard>
      </Section>
    </article>
  );
};

export default Help;
