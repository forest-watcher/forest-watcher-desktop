import { CONDITIONAL_QUESTION_TYPES } from "constants/templates";
import { QuestionModel } from "generated/core/coreSchemas";
import { filterBy } from "helpers/filters";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormFields } from "./components/TemplateForm";

const useTemplateData = (index: number) => {
  const formHook = useFormContext<FormFields>();
  const { control, getValues } = formHook;
  const questions = getValues("questions");
  const question = getValues(`questions.${index}`);
  // @ts-ignore conditions does exist
  const conditions = getValues(`questions.${index}.conditions`);
  // @ts-ignore conditions does exist
  const currentConditionQuestion = getValues(`questions.${index}.conditions.0.name`);

  const watcher = useWatch({ control });
  const defaultLanguage = watcher.defaultLanguage;

  const previousQuestionsAreSelection = useMemo(() => {
    let previousSelectionExists = false;
    if (questions?.length && index > 0) {
      // Search previous Questions
      for (let i = index; i--; i >= 0) {
        const prevQuestion = questions[i];

        if (!previousSelectionExists && prevQuestion) {
          previousSelectionExists = CONDITIONAL_QUESTION_TYPES.indexOf(prevQuestion.type || "") > -1;
        }
      }
    }

    return previousSelectionExists;
  }, [index, questions]);

  const [conditionsQuestions, conditionsAnswers] = useMemo(() => {
    let conditionsQuestions: { value: string; label: string }[] = [];
    let conditionsAnswers: { value: string; label: string }[] = [];

    const conditionalQuestions: QuestionModel[] = filterBy(questions, "type", CONDITIONAL_QUESTION_TYPES);

    if (questions) {
      const conditionalQuestionsFiltered = conditionalQuestions.filter(item => {
        return (item.order || 0) < (question.order || 0);
      });

      // @ts-ignore conditions does exist
      if (conditions.length) {
        const childQuestionList = conditionalQuestionsFiltered.filter(tempQuestion => {
          return tempQuestion.name !== question.name;
        });

        childQuestionList.forEach(function (question) {
          conditionsQuestions.push({
            value: question.name,
            label: question.label[defaultLanguage as keyof typeof question.label] || ""
          });
        });

        // @ts-ignore conditions does exist
        const tempQuestionIndex = filterBy(questions, "name", currentConditionQuestion || "");

        if (tempQuestionIndex.length) {
          const tempQuestion = questions[tempQuestionIndex[0].order];
          const values = tempQuestion?.values
            ? tempQuestion.values[defaultLanguage as keyof typeof tempQuestion.values]
            : [];

          // @ts-ignore values is wrong typing
          conditionsAnswers = values.map(tempAnswers => {
            return {
              value: tempAnswers.value,
              label: tempAnswers.label
            };
          });
        }
      }
    }

    return [conditionsQuestions, conditionsAnswers];
  }, [conditions, currentConditionQuestion, defaultLanguage, question.name, question.order, questions]);

  return {
    previousQuestionsAreSelection,
    conditionalData: [conditionsQuestions, conditionsAnswers]
  };
};

export default useTemplateData;
