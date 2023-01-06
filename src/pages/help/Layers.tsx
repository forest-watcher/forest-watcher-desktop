import Hero from "components/layouts/Hero/Hero";
import Section from "components/ui/Section/Section";
import { FormattedMessage } from "react-intl";

const Help = () => {
  return (
    <article className="relative">
      <Hero title={"help.title"} />
      <Section>
        <Section.Title className="mb-3">
          <FormattedMessage id="help.helpCenter.title" />
        </Section.Title>
        <Section.Text>
          <FormattedMessage id="help.helpCenter.subtitle" />
        </Section.Text>
      </Section>
      <Section altBackground>
        <Section.Title className="mb-3">
          <FormattedMessage id="help.form.title" />
        </Section.Title>
        <Section.Text>
          <FormattedMessage id="help.form.subtitle" />
        </Section.Text>
        <form></form>
      </Section>
    </article>
  );
};

export default Help;
