import List from "components/extensive/List";
import { QuestionModel } from "generated/core/coreSchemas";
import { FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { FormFields } from "./TemplateForm";
import TemplateQuestion from "./TemplateQuestion";

// type TemplateQuestionsProps = {
//   questions: QuestionModel[];
//   defaultLanguage?: string;
// };

interface IProps {
  onQuestionDelete: (index: number) => void;
}

const TemplateQuestions: FC<IProps> = ({ onQuestionDelete }) => {
  const { control, setValue } = useFormContext<FormFields>();
  const watcher = useWatch({ control });

  const { questions = [], defaultLanguage } = watcher;

  const getConditional = (questionName: string, optionValue: number): string => {
    const foundQuestion = questions.find(q => q.name === questionName);
    if (!foundQuestion) return "";
    // @ts-expect-error
    const foundValue = foundQuestion.values[defaultLanguage].find(option => option.value === optionValue);
    if (!foundValue) return "";

    // @ts-expect-error
    return `Only Show if "${foundQuestion.label[defaultLanguage]}" is "${foundValue.label}".`;
  };

  return (
    <List
      items={questions}
      render={(question, index) => (
        <TemplateQuestion
          //@ts-ignore - todo - figure out type being undefined
          question={question}
          defaultLanguage={defaultLanguage}
          getConditional={getConditional}
          onDelete={() => onQuestionDelete(index)}
        />
      )}
    />
  );
};

export default TemplateQuestions;
