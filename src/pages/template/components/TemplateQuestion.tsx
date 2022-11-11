import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import { QuestionModel } from "generated/core/coreSchemas";
import { FormattedMessage } from "react-intl";

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
    if (!childQuestion || !responseOptions || !defaultLanguage) return {};
    return {
      condition: `If the answer is "${
        responseOptions[defaultLanguage][childQuestion.conditionalValue].label
      }" ask for more info`,
      moreInfoText: childQuestion.label[defaultLanguage]
    };
  };

  return (
    <section className="my-10">
      {/* Title */}
      <div className="bg-primary-400 border-2 border-solid border-primary-500 py-7 px-6 rounded-t-[4px] border-opacity-20">
        <p className="text-[24px] text-neutral-700 capitalize">{formattedQuestionName}</p>
      </div>
      {/* Data */}
      <div className="bg-neutral-300 py-7 px-6 border-2 border-solid border-neutral-500 border-opacity-40 rounded-b-[4px]">
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
        {/* Required */}
        <div>
          <h4 className="uppercase font-[500] text-neutral-700 pb-2">
            <FormattedMessage id={"question.required"} />
          </h4>
          <p className="text-base">{`${question.required}`}</p>
        </div>
      </div>
    </section>
  );
};

export default TemplateQuestion;
