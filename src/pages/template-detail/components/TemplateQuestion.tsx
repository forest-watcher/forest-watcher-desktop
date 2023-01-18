import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import HeaderCard from "components/ui/Card/HeaderCard";
import { CONDITIONAL_QUESTION_TYPES } from "constants/templates";
import { QuestionModel } from "generated/core/coreSchemas";
import { FormattedMessage, useIntl } from "react-intl";

type TemplateQuestionProps = {
  question: QuestionModel;
  defaultLanguage?: string;
  getConditional: (questionName: string, optioinValue: number) => string;
};

const TemplateQuestion = ({ question, defaultLanguage, getConditional }: TemplateQuestionProps) => {
  const formattedQuestionName = `${question.name.replace(/-/g, " ")}:`;
  // @ts-expect-error
  const questionText = question.label[defaultLanguage];
  // @ts-expect-error
  const responseOptions = question.values as { [key: string]: { label: string; value: number }[] };
  const isConditionalType = CONDITIONAL_QUESTION_TYPES.indexOf(question.type) > -1;
  const isImageType = question.type === "blob";
  const isSelectionType = question.type === "radio" || question.type === "select";
  const intl = useIntl();

  /**
   * Get Conditionals and More Info Text.
   * @returns { condition?: string; moreInfoText?: string;  }
   */
  const getMoreInfo = (): {
    condition?: string;
    moreInfoText?: string;
  } => {
    const childQuestion =
      // @ts-expect-error
      question?.childQuestions?.length > 0 ? question?.childQuestions[0] : undefined;
    if (!childQuestion || !responseOptions || !defaultLanguage) {
      return {};
    }
    return {
      condition: `If the answer is "${
        responseOptions[defaultLanguage][childQuestion.conditionalValue].label
      }" ask for more info`,
      moreInfoText: childQuestion.label[defaultLanguage]
    };
  };

  return (
    <HeaderCard className="my-10" as="section">
      <HeaderCard.Header>
        <HeaderCard.HeaderText className="capitalize">{formattedQuestionName}</HeaderCard.HeaderText>
      </HeaderCard.Header>
      <HeaderCard.Content>
        {/* Question */}
        <div className="mb-6">
          <h4 className="uppercase font-[500] text-neutral-700 pb-2">
            <FormattedMessage id={"question.question"} />
          </h4>
          <p className="text-base">{questionText}</p>
        </div>
        {/* Response Type */}
        <div className="mb-6">
          <h4 className="uppercase font-[500] text-neutral-700 pb-2">
            <FormattedMessage id={"question.responseType"} />
          </h4>
          <p className="text-base capitalize">
            <FormattedMessage id={`question.${question.type}`} />
          </p>
        </div>
        <OptionalWrapper data={isImageType}>
          <div className="mb-6">
            <h4 className="uppercase font-[500] text-neutral-700 pb-2">
              <FormattedMessage id={"template.edit.maxNumber"} />
            </h4>
            <p className="text-base capitalize">{question.maxImageCount}</p>
          </div>
        </OptionalWrapper>

        {/* Response Options */}
        <OptionalWrapper data={!!responseOptions && isConditionalType}>
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
          data={question.childQuestions?.length > 0 && isSelectionType}
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
          data={question.conditions?.length > 0}
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
        {/* Required */}
        <div>
          <h4 className="uppercase font-[500] text-neutral-700 pb-2">
            <FormattedMessage id={"question.required"} />
          </h4>
          <p className="text-base">{`${
            question.required ? intl.formatMessage({ id: "common.yes" }) : intl.formatMessage({ id: "common.no" })
          }`}</p>
        </div>
      </HeaderCard.Content>
    </HeaderCard>
  );
};

export default TemplateQuestion;
