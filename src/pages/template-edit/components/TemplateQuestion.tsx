import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";
import Input from "components/ui/Form/Input";
import Select from "components/ui/Form/Select";
import Toggle from "components/ui/Form/Toggle";
import { QUESTION_TYPES } from "constants/templates";
import { QuestionModel } from "generated/core/coreSchemas";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { FormFields } from "./TemplateForm";

type TemplateQuestionProps = {
  question: QuestionModel;
  defaultLanguage?: string;
  getConditional: (questionName: string, optioinValue: number) => string;
  onDelete: () => void;
  index: number;
};

const TemplateQuestion = ({
  question,
  defaultLanguage = "",
  getConditional,
  onDelete,
  index
}: TemplateQuestionProps) => {
  const formattedQuestionName = `${question.name.replace(/-/g, " ")}:`;
  //@ts-ignore todo figure out key issue here.
  const responseOptions = question.values as { [key: string]: { label: string; value: number }[] };
  const intl = useIntl();
  const formHook = useFormContext<FormFields>();
  const { register } = formHook;

  /**
   * Get Conditionals and More Info Text.
   * @returns { condition?: string; moreInfoText?: string;  }
   */
  const getMoreInfo = (): {
    condition?: string;
    moreInfoText?: string;
  } => {
    const childQuestion =
      // @ts-expect-error - incorrect typings
      question?.childQuestions?.length > 0 ? question?.childQuestions[0] : undefined;
    if (!childQuestion || !responseOptions || !defaultLanguage) return {};
    return {
      condition: `If the answer is "${
        responseOptions[defaultLanguage][childQuestion.conditionalValue].label
      }" ask for more info`,
      moreInfoText: childQuestion.label[defaultLanguage]
    };
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onDelete();
  };

  console.log(question);

  return (
    <>
      <HeaderCard className="my-10">
        <HeaderCard.Header className="flex justify-between align-middle">
          <HeaderCard.HeaderText className="capitalize">{formattedQuestionName}</HeaderCard.HeaderText>
          <button onClick={handleDelete} aria-label={intl.formatMessage({ id: "common.delete" })}>
            <Icon name="delete-round" size={36} />
          </button>
        </HeaderCard.Header>
        <HeaderCard.Content>
          {/* Question */}
          <div className="mb-6">
            <Input
              id={`text-${index}`}
              htmlInputProps={{
                label: intl.formatMessage({ id: "question.question" }),
                placeholder: intl.formatMessage({ id: "template.edit.title.placeholder" }),
                type: "text"
              }}
              registered={register(`questions.${index}.label.${defaultLanguage as keyof typeof question.label}`)}
              alternateLabelStyle
            />
          </div>
          {/* Response Type */}
          <div className="mb-6">
            <Select
              id={`type-${index}`}
              formHook={formHook}
              registered={register(`questions.${index}.type`)}
              selectProps={{
                placeholder: intl.formatMessage({ id: "question.responseType" }),
                options: QUESTION_TYPES.map(question => ({
                  value: question,
                  label: intl.formatMessage({ id: `questionTypes.${question}` })
                })),
                label: intl.formatMessage({ id: "question.responseType" })
              }}
              alternateLabelStyle
            />
          </div>
          {/* Response Options */}
          <OptionalWrapper data={!!responseOptions}>
            <div className="mb-6">
              <h4 className="uppercase font-[500] text-neutral-700 pb-2">
                <FormattedMessage id={"question.responseOptions"} />
              </h4>
              <List
                items={responseOptions && responseOptions[defaultLanguage ?? ""]}
                render={option => <p className="text-base mb-1">{option.label}</p>}
              />
            </div>
          </OptionalWrapper>
          {/* Conditions */}
          <OptionalWrapper
            // @ts-expect-error
            data={question.childQuestions?.length > 0}
          >
            <div className="mb-6">
              <h4 className="uppercase font-[500] text-neutral-700 pb-2">
                <FormattedMessage id={"question.conditions"} />
              </h4>
              <p className="text-base">{getMoreInfo().condition}</p>
            </div>
            <div className="mb-6">
              <h4 className="uppercase font-[500] text-neutral-700 pb-2">
                <FormattedMessage id={"question.moreInfo"} />
              </h4>
              <p className="text-base">{getMoreInfo().moreInfoText}</p>
            </div>
          </OptionalWrapper>
          {/* Only Show IF */}
          <OptionalWrapper
            // @ts-expect-error
            data={question.conditions.length > 0}
          >
            <div className="mb-6">
              <h4 className="uppercase font-[500] text-neutral-700 pb-2">
                <FormattedMessage id={"question.onlyShowIf"} />
              </h4>
              <List
                // @ts-expect-error
                items={question?.conditions}
                render={condition => (
                  <p className="text-base capitalize">{getConditional(condition.name, condition.value)}</p>
                )}
              />
            </div>
          </OptionalWrapper>
        </HeaderCard.Content>
        <HeaderCard.Footer className="flex justify-end">
          <Toggle
            id={`required-${index}`}
            registered={register(`questions.${index}.required`)}
            formHook={formHook}
            toggleProps={{ label: intl.formatMessage({ id: "question.required" }) }}
            labelClass="capitalize font-normal text-base"
          />
        </HeaderCard.Footer>
      </HeaderCard>
    </>
  );
};

export default TemplateQuestion;
