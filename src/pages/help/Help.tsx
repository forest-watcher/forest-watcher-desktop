import Hero from "components/layouts/Hero/Hero";
import HeaderCard from "components/ui/Card/HeaderCard";
import EmptyState from "components/ui/EmptyState/EmptyState";
import Section from "components/ui/Section/Section";
import { FormattedMessage, useIntl } from "react-intl";
import HelpIcon from "assets/images/icons/Help.svg";

const Help = () => {
  const intl = useIntl();

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
          <form>
            <HeaderCard.Content>Add form copy here</HeaderCard.Content>
            <HeaderCard.Footer>
              <input type="submit" className="c-button c-button--primary" disabled />
            </HeaderCard.Footer>
          </form>
        </HeaderCard>
      </Section>
    </article>
  );
};

export default Help;
