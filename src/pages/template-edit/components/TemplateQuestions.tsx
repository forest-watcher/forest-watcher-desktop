import List from "components/extensive/List";
import { FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./TemplateForm";
import TemplateQuestion from "./TemplateQuestion";

interface IProps {
  onQuestionDelete: (index: number) => void;
}

const TemplateQuestions: FC<IProps> = ({ onQuestionDelete }) => {
  const { control } = useFormContext<FormFields>();
  const watcher = useWatch({ control });

  const { questions = [], defaultLanguage } = watcher;

  return (
    <List
      items={questions}
      render={(question, index) => (
        <TemplateQuestion
          //@ts-ignore - todo - figure out type being undefined
          question={question}
          defaultLanguage={defaultLanguage}
          onDelete={() => onQuestionDelete(index)}
          index={index}
        />
      )}
    />
  );
};

export default TemplateQuestions;
