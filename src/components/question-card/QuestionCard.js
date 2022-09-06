import { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import { prettyNum } from "../../helpers/utils";
import { getSelectorValueFromArray } from "../../helpers/filters";
import Select from "react-select";
import Icon from "../ui/Icon";
import Checkbox from "../ui/Checkbox";
import { CHILD_QUESTION, CONDITIONAL_QUESTION_TYPES } from "../../constants/templates";
import { filterBy } from "../../helpers/filters";
import Switch from "react-toggle-switch";
import DropdownIndicator from "../ui/SelectDropdownIndicator";

class QuestionCard extends Component {
  constructor(props) {
    super(props);
    this.question = { ...props.question };
    this.inputs = {};
  }

  // life cycle
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.question !== this.props.question) {
      this.question = { ...nextProps.question };
    }
  }

  ///////////////////////////////
  // simple question actions -> name, type, options (for conditional type questions)
  ///////////////////////////////
  onInputChange = e => {
    this.question = {
      ...this.question,
      label: {
        ...this.question.label,
        [this.props.defaultLanguage]: e.target.value
      }
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onQuestionOptionAdd = () => {
    let values = this.question.values[this.props.defaultLanguage];
    values.push({
      value: values.length,
      label: ""
    });
    this.question = {
      ...this.question,
      values: {
        ...this.question.values,
        [this.props.defaultLanguage]: values
      }
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onQuestionOptionChange = (e, index) => {
    let values = this.question.values[this.props.defaultLanguage];
    values[index].label = e.target.value;
    this.question = {
      ...this.question,
      values: {
        ...this.question.values,
        [this.props.defaultLanguage]: values
      }
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onTypeChange = selected => {
    if (CONDITIONAL_QUESTION_TYPES.indexOf(selected.value) > -1) {
      this.question = {
        ...this.question,
        type: selected.value,
        values: {
          [this.props.defaultLanguage]: [
            {
              value: 0,
              label: ""
            }
          ]
        },
        childQuestions: [],
        conditions: []
      };
    } else {
      this.question = {
        ...this.question,
        type: selected.value,
        values: {},
        childQuestions: [],
        conditions: []
      };
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  ///////////////////////////////
  // handle childquestions inputs -> checkbox, selector for option, more info translation input
  ///////////////////////////////
  handleChangeMoreInfo = () => {
    if (this.question.childQuestions.length > 0) {
      this.question = {
        ...this.question,
        childQuestions: []
      };
    } else {
      let childQuestions = [];
      childQuestions[0] = {
        ...CHILD_QUESTION,
        label: {
          [this.props.defaultLanguage]: ""
        },
        name: `${this.question.name}-more-info`
      };
      this.question = {
        ...this.question,
        childQuestions: childQuestions
      };
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onMoreInfoSelect = selected => {
    let childQuestions = this.question.childQuestions.slice();
    childQuestions[0].conditionalValue = selected.option;
    this.question = {
      ...this.question,
      childQuestions: childQuestions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onChildInputChange = e => {
    let childQuestions = this.question.childQuestions.slice();
    childQuestions[0].label[this.props.defaultLanguage] = e.target.value;
    this.question = {
      ...this.question,
      childQuestions: childQuestions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  ///////////////////////////////
  // actions for card footer actions -> delete question, make required
  ///////////////////////////////
  deleteOption = index => {
    // FIXME: Without mutation conditionals do not appear correctly
    let values = this.question.values[this.props.defaultLanguage];
    values.splice(index, 1);
    this.question = {
      ...this.question,
      values: {
        ...this.question.values,
        [this.props.defaultLanguage]: values
      }
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  toggleRequired = () => {
    let required = this.question.required;
    required = required ? false : true;
    this.question = {
      ...this.question,
      required: required
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  ///////////////////////////////
  // handle external conditions -> checkbox, question selector, answers selector
  ///////////////////////////////
  handleChangeOnlyShow = () => {
    if (this.question.conditions.length > 0) {
      this.question = {
        ...this.question,
        conditions: []
      };
    } else {
      let conditions = [];
      const conditionalQuestionList = this.props.template.questions.filter(tempQuestion => {
        return tempQuestion.name !== this.question.name && CONDITIONAL_QUESTION_TYPES.indexOf(tempQuestion.type) > -1;
      });

      conditionalQuestionList.forEach(function (question) {
        conditions.push({
          name: question.name,
          value: question.order
        });
      });

      this.question = {
        ...this.question,
        conditions: conditions
      };
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onOnlyShowQuestionSelect = selected => {
    let conditions = this.question.conditions.slice();
    conditions[0] = {
      ...conditions[0],
      name: selected.option,
      value: 0
    };
    this.question = {
      ...this.question,
      conditions: conditions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  onOnlyShowAnswerSelect = selected => {
    let conditions = this.question.conditions.slice();
    conditions[0] = {
      ...conditions[0],
      value: selected.option
    };
    this.question = {
      ...this.question,
      conditions: conditions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  };

  ///////////////////////////////
  // time to render -> just like bender
  ///////////////////////////////
  render() {
    const { template, question, questionOptions, questionNum, defaultLanguage, deleteQuestion, canManage, mode } =
      this.props;

    // rendering variables
    const isConditional = CONDITIONAL_QUESTION_TYPES.indexOf(question.type) > -1 ? true : false;
    const conditionalQuestions = filterBy(template.questions, "type", CONDITIONAL_QUESTION_TYPES);
    const conditionalQuestionsFiltered = conditionalQuestions.filter(item => {
      return item.order < question.order;
    });

    // selector options that are dependant on local state
    const conditionalOptions = [];
    let conditionsQuestions = [];
    let conditionsAnswers = [];
    if (question.conditions.length) {
      const childQuestionList = conditionalQuestionsFiltered.filter(tempQuestion => {
        return tempQuestion.name !== question.name;
      });

      childQuestionList.forEach(function (question) {
        conditionsQuestions.push({
          option: question.name,
          label: question.label[template.defaultLanguage]
        });
      });

      const tempQuestionIndex = filterBy(template.questions, "name", question.conditions[0].name);
      conditionsAnswers = template.questions[tempQuestionIndex[0].order].values[template.defaultLanguage].map(
        tempAnswers => {
          return {
            option: tempAnswers.value,
            label: tempAnswers.label
          };
        }
      );
    }

    if (question.values && question.values[defaultLanguage]) {
      question.values[defaultLanguage].forEach(value => {
        conditionalOptions.push({
          option: value.value,
          label: value.label
        });
      });
    }

    // permissions bools that are dependant on locale state
    const conditionalQuestionCount = filterBy(conditionalQuestionsFiltered, "type", CONDITIONAL_QUESTION_TYPES).length;
    const canSetConditional = template.questions.length && conditionalQuestionCount > 0 ? true : false;
    // do not allow questions to be edited unless template is in create mode due to API issues
    // todo: remove this once API has been updated to support editing questions
    const modeCreate = mode === "create" ? true : false;
    // finally we can render all that fancy stuff
    return (
      <section className="c-question-card">
        <div className="question-card">
          <div className="questions">
            <span className="text -question-number">{prettyNum(questionNum)}.</span>
            <input
              type="text"
              className="-question"
              onChange={this.onInputChange}
              name="label"
              value={question.label[defaultLanguage] || ""}
              placeholder={this.props.intl.formatMessage({ id: "templates.questionPlaceholder" })}
              onKeyPress={e => {
                if (e.which === 13) {
                  e.preventDefault();
                }
              }} // Prevent send on press Enter
              disabled={!canManage || !modeCreate}
              required
            />
            <Select
              name="type"
              className="type-select"
              options={questionOptions}
              value={questionOptions.find(option => option.value === question.type)}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
              onChange={this.onTypeChange}
              isSearchable={false}
              isClearable={false}
              isDisabled={!canManage || !modeCreate}
              components={{ DropdownIndicator }}
            />
            <div className="question-options">
              {isConditional &&
                question.values[defaultLanguage].map((value, index) => (
                  <div key={`${question.name}-value-${index}`}>
                    <input
                      className="option-input -question"
                      ref={input => {
                        this.inputs[index] = input;
                      }}
                      value={value.label}
                      onKeyPress={e => {
                        if (e.which === 13) {
                          e.preventDefault();
                        }
                      }} // Prevent send on press Enter
                      placeholder={this.props.intl.formatMessage({ id: "templates.optionPlaceholder" })}
                      onChange={e => this.onQuestionOptionChange(e, index)}
                      disabled={!canManage || !modeCreate}
                      required
                    />
                    {canManage && question.values[defaultLanguage].length > 1 && (
                      <button
                        className={"delete-button"}
                        type="button"
                        disabled={!modeCreate}
                        onClick={() => {
                          this.deleteOption(index);
                        }}
                      >
                        <Icon className="-small -theme-gray" name="icon-more" />
                      </button>
                    )}
                  </div>
                ))}
              {isConditional && canManage && (
                <button
                  className="c-button c-button--secondary add-option-button"
                  type="button"
                  onClick={this.onQuestionOptionAdd}
                  disabled={!modeCreate}
                >
                  <FormattedMessage id={"templates.addOption"} />
                </button>
              )}
              {isConditional && (
                <div className="question-more-info">
                  <div className="conditional-settings">
                    <Checkbox
                      id={`${questionNum}-more-info`}
                      callback={() => this.handleChangeMoreInfo(questionNum)}
                      defaultChecked={question.childQuestions.length > 0}
                      disabled={!canManage || !modeCreate}
                    />
                    <label className="text">{this.props.intl.formatMessage({ id: "templates.moreInfoFirst" })}</label>
                    <Select
                      name="more-info-answer"
                      className="more-info-select"
                      options={conditionalOptions}
                      value={
                        question.childQuestions.length
                          ? getSelectorValueFromArray(question.childQuestions[0].conditionalValue, conditionalOptions)
                          : null
                      }
                      onChange={this.onMoreInfoSelect}
                      isSearchable={false}
                      isClearable={false}
                      placeholder={this.props.intl.formatMessage({ id: "templates.selectCondition" })}
                      noResultsText={this.props.intl.formatMessage({ id: "templates.noConditions" })}
                      components={{ DropdownIndicator }}
                      isDisabled={!canManage || !question.childQuestions.length || !modeCreate}
                    />
                    <label className="text">{this.props.intl.formatMessage({ id: "templates.moreInfoSecond" })}</label>
                  </div>
                  {question.childQuestions.length > 0 && (
                    <input
                      type="text"
                      className="child-input -question"
                      onChange={this.onChildInputChange}
                      name="childquestion-label"
                      value={question.childQuestions[0].label[defaultLanguage] || ""}
                      placeholder={this.props.intl.formatMessage({ id: "templates.childQuestionPlaceholder" })}
                      onKeyPress={e => {
                        if (e.which === 13) {
                          e.preventDefault();
                        }
                      }} // Prevent send on press Enter
                      disabled={!canManage || !modeCreate}
                      required
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="question-actions">
            {canManage && template.questions.length > 1 && (
              <button
                className={"delete-button"}
                type="button"
                onClick={() => {
                  deleteQuestion(questionNum);
                }}
                disabled={!canManage || !modeCreate}
              >
                <Icon className="-small -gray" name="icon-delete" />
              </button>
            )}
            <span className="required-label text -x-small-title">
              {this.props.intl.formatMessage({ id: "templates.required" })}
            </span>
            <Switch
              className="c-switcher required"
              onClick={this.toggleRequired}
              on={question.required}
              enabled={canManage && modeCreate}
            />
          </div>
        </div>
        {canSetConditional && (
          <div className="question-footer">
            <Checkbox
              id={`${questionNum}-only-show`}
              callback={() => this.handleChangeOnlyShow(questionNum)}
              checked={question.conditions.length > 0}
              disabled={!canManage || !modeCreate}
            />
            <label className="text">{this.props.intl.formatMessage({ id: "templates.onlyShow" })}</label>
            <Select
              name="only-show-question"
              className="only-show-select"
              options={conditionsQuestions}
              value={
                question.conditions.length
                  ? getSelectorValueFromArray(question.conditions[0].name, conditionsQuestions)
                  : null
              }
              onChange={this.onOnlyShowQuestionSelect}
              isSearchable={false}
              isClearable={false}
              placeholder={this.props.intl.formatMessage({ id: "templates.selectQuestion" })}
              components={{ DropdownIndicator }}
              isDisabled={!canManage || !question.conditions.length || !modeCreate}
            />
            <label className="text">{this.props.intl.formatMessage({ id: "templates.is" })}</label>
            <Select
              name="only-show-answer"
              className="only-show-select"
              options={conditionsAnswers}
              value={
                question.conditions.length
                  ? getSelectorValueFromArray(question.conditions[0].value, conditionsAnswers)
                  : null
              }
              onChange={this.onOnlyShowAnswerSelect}
              isSearchable={false}
              isClearable={false}
              placeholder={this.props.intl.formatMessage({ id: "templates.selectOption" })}
              components={{ DropdownIndicator }}
              isDisabled={!canManage || !question.conditions.length || !modeCreate}
            />
          </div>
        )}
      </section>
    );
  }
}

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  questionNum: PropTypes.number.isRequired,
  defaultLanguage: PropTypes.string,
  intl: PropTypes.object
};

export default injectIntl(QuestionCard);
