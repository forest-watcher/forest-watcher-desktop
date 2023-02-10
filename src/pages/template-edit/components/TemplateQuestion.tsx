import { Switch } from "@headlessui/react";
import Icon from "components/extensive/Icon";
import List from "components/extensive/List";
import OptionalWrapper from "components/extensive/OptionalWrapper";
import Button from "components/ui/Button/Button";
import HeaderCard from "components/ui/Card/HeaderCard";
import Input from "components/ui/Form/Input";
import Select from "components/ui/Form/Select";
import Toggle from "components/ui/Form/Toggle";
import { CHILD_QUESTION, CONDITIONAL_QUESTION_TYPES, QUESTION_TYPES } from "constants/templates";
import { QuestionModel } from "generated/core/coreSchemas";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { FormFields } from "./TemplateForm";
import useTemplateData from "../useTemplateData";

type TemplateQuestionProps = {
  question: QuestionModel;
  defaultLanguage?: string;
  onDelete: () => void;
  index: number;
};

type valuesType = { [key: string]: { label: string; value: number }[] };

const TemplateQuestion = ({ question, defaultLanguage = "", onDelete, index }: TemplateQuestionProps) => {
  const [previousDefaultLang, setPreviousDefaultLang] = useState(defaultLanguage);
  const formattedQuestionName = `${question.name.replace(/-/g, " ")}:`;
  //@ts-ignore todo figure out key issue here.
  const responseOptions = question.values as valuesType;
  const intl = useIntl();
  const formHook = useFormContext<FormFields>();
  const {
    register,
    getValues,
    setValue,
    control,
    formState: { errors }
  } = formHook;
  const watcher = useWatch({ control });
  const isConditional = CONDITIONAL_QUESTION_TYPES.indexOf(question.type) > -1;

  // @ts-ignore incorrect typings;
  const canAddCondition = watcher?.questions[index]?.childQuestions?.length > 0 || false;
  // @ts-ignore incorrect typings;
  const canAddPreviousQuestionCondition = watcher?.questions[index]?.conditions?.length > 0 || false;
  const isImageQuestion = watcher?.questions ? watcher?.questions[index]?.type === "blob" : false;

  const {
    previousQuestionsAreSelection,
    conditionalData: [conditionsQuestions, conditionsAnswers]
  } = useTemplateData(index);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onDelete();
  };

  const handleDeleteOption = (questionIndex: number, valueIndex: number) => {
    const values =
      (getValues(
        // @ts-ignore
        `questions.${questionIndex}.values.${defaultLanguage as keyof typeof question.label}`
      ) as valuesType) || [];

    // @ts-ignore
    const newQs = [...values];
    newQs.splice(valueIndex, 1);

    newQs.forEach((q, index) => {
      q.value = index;
    });

    // @ts-ignore
    setValue(`questions.${questionIndex}.values.${defaultLanguage as keyof typeof question.label}`, newQs, {
      shouldDirty: true
    });
  };

  const handleAddOption = (questionIndex: number) => {
    const values =
      (getValues(
        // @ts-ignore
        `questions.${questionIndex}.values.${defaultLanguage as keyof typeof question.label}`
      ) as valuesType) || [];

    // @ts-ignore
    values.push({
      value: values.length,
      label: ""
    });

    // @ts-ignore
    setValue(`questions.${questionIndex}.values.${defaultLanguage as keyof typeof question.label}`, values, {
      shouldDirty: true
    });
  };

  const handleCanAddCondition = (checked: boolean, questionIndex: number) => {
    const questionName = getValues(`questions.${questionIndex}.name`);
    let newQuestions = [];
    if (checked) {
      newQuestions.push({
        ...CHILD_QUESTION,
        label: {
          [defaultLanguage]: ""
        },
        name: `${questionName}-more-info`
      });
    }

    // @ts-ignore incorrect typings.
    setValue(`questions.${questionIndex}.childQuestions`, newQuestions, {
      shouldDirty: true
    });
  };

  const handleCanAddConditionBasedOnPrevious = (checked: boolean, questionIndex: number) => {
    const conditions: { name: string; value: number }[] = [];

    const questions = watcher.questions;

    if (checked && questions) {
      const question = questions[questionIndex];

      const conditionalQuestionList = questions.filter(tempQuestion => {
        return tempQuestion.name !== question.name && CONDITIONAL_QUESTION_TYPES.indexOf(tempQuestion.type || "") > -1;
      });

      if (conditionalQuestionList[0]) {
        conditions.push({
          name: conditionalQuestionList[0].name || "",
          value: conditionalQuestionList[0].order || 0
        });
      }
    }

    // @ts-ignore incorrect typings.
    setValue(`questions.${questionIndex}.conditions`, conditions, {
      shouldDirty: true
    });
  };

  useEffect(() => {
    const values = getValues(
      // @ts-ignore
      `questions.${index}.values.${defaultLanguage as keyof typeof question.label}`
    ) as valuesType;

    if (isConditional && !values) {
      // @ts-ignore incorrect typings
      setValue(`questions.${index}.values.${defaultLanguage as keyof typeof question.label}`, [], {
        shouldDirty: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConditional]);

  useEffect(() => {
    // Remove old lang data
    const currentQuestionTitle = getValues(`questions.${index}.label`);

    const newTitle: any = {};

    newTitle[defaultLanguage as keyof typeof currentQuestionTitle] =
      currentQuestionTitle[previousDefaultLang as keyof typeof currentQuestionTitle];

    setValue(`questions.${index}.label`, newTitle, { shouldDirty: true });

    // Check values (select etc..)
    const currentQuestionValues = getValues(`questions.${index}.values`);

    if (currentQuestionValues?.[previousDefaultLang as keyof typeof currentQuestionValues]) {
      const newValues: any = {};

      newValues[defaultLanguage as keyof typeof currentQuestionValues] =
        currentQuestionValues[previousDefaultLang as keyof typeof currentQuestionValues];

      setValue(`questions.${index}.values`, newValues, { shouldDirty: true });
    }

    setPreviousDefaultLang(defaultLanguage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLanguage]);

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
              registered={register(`questions.${index}.label.${defaultLanguage as keyof QuestionModel["label"]}`)}
              alternateLabelStyle
              error={errors?.questions?.[index]?.label?.[defaultLanguage as keyof QuestionModel["label"]]}
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
              className="max-w-[334px]"
            />
          </div>
          <OptionalWrapper data={isImageQuestion}>
            <div className="mb-6">
              <Input
                id={`number-count-${index}`}
                htmlInputProps={{
                  label: intl.formatMessage({ id: "template.edit.maxNumber" }),
                  placeholder: intl.formatMessage({ id: "template.edit.maxNumberPlaceholder" }),
                  type: "number"
                }}
                registered={register(`questions.${index}.maxImageCount`, { valueAsNumber: true })}
                alternateLabelStyle
                error={errors?.questions && errors?.questions[index] && errors?.questions[index].maxImageCount}
              />
            </div>
          </OptionalWrapper>
          {/* Response Options */}
          <OptionalWrapper data={!!responseOptions}>
            <div className="mb-6">
              <List
                items={responseOptions && responseOptions[defaultLanguage ?? ""]}
                render={(option, optionIndex) => (
                  <div className="flex items-stretch mb-3 gap-3 w-full">
                    <div className="not-sr-only flex justify-center align-middle w-[42px] h-[40px] bg-primary-400 border-solid border border-primary-500 rounded-[6px] font-base capitalize text-neutral-700">
                      {String.fromCharCode(97 + optionIndex)}
                    </div>
                    <Input
                      id={`option-${index}-${optionIndex}`}
                      htmlInputProps={{
                        label: intl.formatMessage({ id: "template.edit.responseOption" }),
                        placeholder: intl.formatMessage({ id: "template.edit.responseOption.placeholder" }),
                        type: "text"
                      }}
                      registered={register(
                        // @ts-ignore - incorrect typing for values
                        `questions.${index}.values.${
                          defaultLanguage as keyof QuestionModel["label"]
                        }.${optionIndex}.label`
                      )}
                      hideLabel
                      className="flex-grow"
                      wrapperClassName="w-full"
                      // @ts-ignore typing issue
                      error={errors?.questions?.[index]?.values?.[defaultLanguage]?.[optionIndex]?.label}
                    />
                    <button
                      onClick={e => {
                        e.preventDefault();
                        handleDeleteOption(index, optionIndex);
                      }}
                      aria-label={intl.formatMessage({ id: "common.delete" })}
                    >
                      <Icon name="delete-round" size={36} />
                    </button>
                  </div>
                )}
              />
              <OptionalWrapper data={isConditional}>
                <Button
                  variant="secondary"
                  onClick={e => {
                    e.preventDefault();
                    handleAddOption(index);
                  }}
                  className="flex gap-[10px] items-center mt-3"
                >
                  <Icon size={14} name="PlusForButton" className="relative top-[-1px]" />
                  <FormattedMessage id="templates.addOption" />
                </Button>
              </OptionalWrapper>
            </div>
          </OptionalWrapper>
          {/* Conditions */}

          <OptionalWrapper data={isConditional}>
            <Switch.Group key={index}>
              <div className="flex items-center gap-4">
                <Switch
                  checked={canAddCondition}
                  onChange={(checked: boolean) => {
                    handleCanAddCondition(checked, index);
                  }}
                  name={`condition-${index}`}
                >
                  {({ checked }) => (checked ? <Icon name="RadioOn" /> : <Icon name="RadioOff" />)}
                </Switch>
                <Switch.Label className="cursor-pointer text-sm uppercase font-medium text-neutral-700">
                  <FormattedMessage id="template.edit.addCondition" />
                </Switch.Label>
              </div>
            </Switch.Group>
          </OptionalWrapper>
          {canAddCondition && Boolean(responseOptions) && (
            <>
              <Select
                id={`conditional-${index}`}
                formHook={formHook}
                // @ts-ignore
                registered={register(`questions.${index}.childQuestions.0.conditionalValue`)}
                selectProps={{
                  placeholder: intl.formatMessage({ id: "template.edit.selectResponse" }),
                  options:
                    (responseOptions &&
                      responseOptions[defaultLanguage]?.map(option => ({
                        value: option.value,
                        label: option.label
                      }))) ||
                    [],
                  label: intl.formatMessage({ id: "template.edit.selectResponse.placeholder" })
                }}
                className="mt-4 mb-7"
              />
              <Input
                id={`conditional-input-${index}`}
                htmlInputProps={{
                  label: intl.formatMessage({ id: "template.edit.selectResponseText" }),
                  placeholder: intl.formatMessage({ id: "template.edit.selectResponseText.placeholder" }),
                  type: "text"
                }}
                registered={register(
                  // @ts-ignore
                  `questions.${index}.childQuestions.0.label.${defaultLanguage as keyof typeof question.label}`
                )}
                alternateLabelStyle
                // @ts-ignore typing issue
                error={errors?.questions?.[index]?.childQuestions?.[0]?.label?.[defaultLanguage]}
              />
            </>
          )}
          <OptionalWrapper data={previousQuestionsAreSelection}>
            <div className="flex align-middle gap-3 flex-wrap mt-10 min-h-[40px]">
              <Switch.Group>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={canAddPreviousQuestionCondition}
                    onChange={(checked: boolean) => {
                      handleCanAddConditionBasedOnPrevious(checked, index);
                    }}
                    name={`condition-previous-${index}`}
                  >
                    {({ checked }) => (checked ? <Icon name="RadioOn" /> : <Icon name="RadioOff" />)}
                  </Switch>
                  <Switch.Label className="cursor-pointer text-sm uppercase font-medium text-neutral-700">
                    <FormattedMessage id="template.edit.onlyShow" />
                  </Switch.Label>
                </div>
              </Switch.Group>
              {canAddPreviousQuestionCondition && (
                <div className="flex flex-wrap gap-4">
                  <Select
                    id={`conditional-questions-${index}`}
                    formHook={formHook}
                    // @ts-ignore
                    registered={register(`questions.${index}.conditions.0.name`)}
                    selectProps={{
                      placeholder: intl.formatMessage({ id: "template.edit.selectQuestion" }),
                      options: conditionsQuestions,
                      label: intl.formatMessage({ id: "template.edit.selectQuestion" })
                    }}
                    hideLabel
                  />
                  <Select
                    id={`conditional-answers-${index}`}
                    formHook={formHook}
                    // @ts-ignore
                    registered={register(`questions.${index}.conditions.0.value`)}
                    selectProps={{
                      placeholder: intl.formatMessage({ id: "template.edit.selectOption" }),
                      options: conditionsAnswers,
                      label: intl.formatMessage({ id: "templates.is" })
                    }}
                    labelClass="text-sm font-medium"
                  />
                </div>
              )}
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
