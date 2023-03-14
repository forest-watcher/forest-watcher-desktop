import List from "components/extensive/List";
import { QuestionModel } from "generated/core/coreSchemas";
import { FormattedMessage } from "react-intl";
import TemplateQuestion from "./TemplateQuestion";

type TemplateQuestionsProps = {
  questions: QuestionModel[];
  defaultLanguage?: string;
};

const TemplateQuestions = ({ questions, defaultLanguage }: TemplateQuestionsProps) => {
  const getConditional = (questionName: string, optionValue: number): string => {
    const foundQuestion = questions.find(q => q.name === questionName);
    if (!foundQuestion || !defaultLanguage) {
      return "";
    }

    // @ts-ignore
    const foundValue = foundQuestion.values[defaultLanguage].find(option => option.value === optionValue);
    if (!foundValue) {
      return "";
    }

    return `Only Show if "${foundQuestion.label[defaultLanguage as keyof typeof foundQuestion.label]}" is "${
      foundValue.label
    }".`;
  };

  return (
    <section className="bg-neutral-400">
      <div className="row column py-section">
        <h1 className="font-base text-[36px] font-light text-neutral-700 mb-10">
          <FormattedMessage id="template.questions" />
        </h1>
        <List
          items={questions}
          render={question => (
            <TemplateQuestion question={question} defaultLanguage={defaultLanguage} getConditional={getConditional} />
          )}
        />
      </div>
    </section>
  );
};

export default TemplateQuestions;
