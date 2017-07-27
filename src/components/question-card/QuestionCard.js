import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { prettyNum } from '../../helpers/utils';
import { getSelectorValueFromArray } from '../../helpers/filters';
import Select from 'react-select';
import Icon from '../ui/Icon';
import SwitchButton from 'react-switch-button';
import Checkbox from '../ui/Checkbox';
import { CHILD_QUESTION, CONDITIONAL_QUESTION_TYPES } from '../../constants/templates';
import { filterBy } from '../../helpers/filters';


class QuestionCard extends React.Component {
  constructor (props) {
    super(props);
    this.question = { ...props.question };
    this.inputs = {};
  }

  // life cycle
  componentWillReceiveProps(nextProps) {
    if (nextProps.question !== this.props.question) {
        this.question = { ...nextProps.question };
    }
  }


  ///////////////////////////////
  // add question handler
  ///////////////////////////////
  onQuestionOptionAdd = () => {
    let values = this.question.values[this.props.defaultLanguage];
    values.push({
        value: values.length,
        label: ''
    });
    this.questsion = {
        ...this.question,
        values: {
            ...this.question.values,
            [this.props.defaultLanguage]: values
        }
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }


  ///////////////////////////////
  // simple question actions -> name, type, options (for conditional type questions)
  ///////////////////////////////
  onInputChange = (e) => {
    this.question = {
        ...this.question,
        label: {
            ...this.question.label,
            [this.props.defaultLanguage]: e.target.value
        } 
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onQuestionOptionChange = (e, index) => {
    let values = this.question.values[this.props.defaultLanguage];
    values[index].label = e.target.value;
    this.question = {
        ...this.question,
        values: {
            ...this.question.values,
            [this.props.defaultLanguage]: values
        } 
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onTypeChange = (selected) => {
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
            }
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
  }


  ///////////////////////////////
  // hnadle childquestions inputs -> checkbox, selector for option, more info translation input
  ///////////////////////////////
  handleChangeMoreInfo = () => {
    if (this.question.childQuestions.length > 0) {
        this.question = {
            ...this.question,
            childQuestions: []
        }
    } else {
        let childQuestions = []
        childQuestions[0] = {
            ...CHILD_QUESTION,
            label: {
                [this.props.defaultLanguage]: ""
            }
        }
        this.question = {
            ...this.question,
            childQuestions: childQuestions
        }
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onMoreInfoSelect = (selected) => {
    let childQuestions = this.question.childQuestions.slice();
    childQuestions[0].conditionalValue = selected.option;
    this.question = { 
        ...this.question,
        childQuestions: childQuestions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onChildInputChange = (e) => {
    let childQuestions = this.question.childQuestions.slice();
    childQuestions[0].label[this.props.defaultLanguage] = e.target.value;
    this.question = { 
        ...this.question,
        childQuestions: childQuestions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }


  ///////////////////////////////
  // actions for card footer actions -> delete question, make required
  ///////////////////////////////
  deleteOption = (index) => {
    let values = this.question.values[this.props.defaultLanguage];
    values.splice(index, 1);
    this.question = {
        ...this.question,
        values: {
            ...this.question.values,
            [this.props.defaultLanguage]: values
        } 
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

    
  toggleRequired = () => {
    let required = this.question.required;
    required = required ? false : true;
    this.question = {
        ...this.question,
        required: required
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }


  ///////////////////////////////
  // handle external conditions -> checkbox, question selector, answers selector
  ///////////////////////////////
  handleChangeOnlyShow = () => {
    if (this.question.conditions.length > 0) {
        this.question = {
            ...this.question,
            conditions: []
        }
    } else {
        let conditions = [];
        const conditionalQuestions = filterBy(this.props.template.questions, 'type', CONDITIONAL_QUESTION_TYPES);
        conditionalQuestions.some((question) => {
            if (question.name !== this.question.name) {
                conditions[0] = {
                    name: question.name,
                    value: 0,
                    index: question.order
                }
                return true;
            }
        })
        this.question = {
            ...this.question,
            conditions: conditions
        }
    }
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onOnlyShowQuestionSelect = (selected) => {
    let conditions = this.question.conditions.slice();
    conditions[0] = {
        ...conditions[0],
        name: selected.value
    }
    selected.option;
    this.question = { 
        ...this.question,
        conditions: conditions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

  onOnlyShowAnswerSelect = (selected) => {
    let conditions = this.question.conditions.slice();
    conditions[0] = {
        ...conditions[0],
        value: selected.value
    }
    selected.option;
    this.question = { 
        ...this.question,
        conditions: conditions
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }


  ///////////////////////////////
  // time to render -> just like bender
  ///////////////////////////////
  render() {
    const { template, question, questionOptions, questionNum, defaultLanguage, deleteQuestion, canEdit, canManage } = this.props;
    
    // permissions and rendering variables
    const isConditional = CONDITIONAL_QUESTION_TYPES.indexOf(question.type) > -1 ? true : false;
    const conditionalQuestions = filterBy(this.props.template.questions, 'type', CONDITIONAL_QUESTION_TYPES);
   
    // selector options that are dependant on local state
    const conditionalOptions = [];
    let conditionsQuestions = [];
    let conditionsAnswers = [];
    if (question.conditions.length) {
        conditionsQuestions = conditionalQuestions.map((tempQuestion) => {
            if (tempQuestion.name !== question.name) {
                return {
                    option: tempQuestion.name,
                    label: tempQuestion.label[template.defaultLanguage]
                }
            }
        });
        conditionsAnswers = template.questions[question.conditions[0].index].values[template.defaultLanguage].map((tempQuestion) => {
            if (tempQuestion.name !== this.question.name) {
                return {
                    option: tempQuestion.value,
                    label: tempQuestion.label
                }
            }
        });
    }
    if (question.values && question.values[defaultLanguage]) {
        question.values[defaultLanguage].forEach((value) => {
            conditionalOptions.push({
                option: value.value,
                label: value.label
            });
        });
    }

    // permissions bools that are dependant on locale state
    const conditionalQuestionCount = filterBy(this.props.template.questions, 'type', CONDITIONAL_QUESTION_TYPES).length;
    const canSetConditional = template.questions.length && 
                              ((conditionalQuestionCount > 0 && !isConditional) ||
                              (conditionalQuestionCount > 1))
                              ? true : false;

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
                            value={question.label[defaultLanguage] || ''}
                            placeholder={this.props.intl.formatMessage({ id: 'templates.questionPlaceholder' })}
                            onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                            disabled={!canManage}
                        />
                        <Select
                            name="type"
                            className="type-select"
                            options={questionOptions}
                            value={question.type}
                            onChange={this.onTypeChange}
                            searchable={false}
                            clearable={false}
                            disabled={!canEdit}
                            arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
                        />
                        <div className="question-options">
                            { isConditional && 
                                question.values[defaultLanguage].map((value, index) =>
                                    <div key={`${question.name}-value-${index}`} >
                                        <input
                                            className="option-input -question"
                                            ref={(input) => { this.inputs[index] = input; }}
                                            value={value.label}
                                            onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                                            placeholder={this.props.intl.formatMessage({ id: 'templates.optionPlaceholder' })}
                                            onChange={(e) => this.onQuestionOptionChange(e, index)}
                                            disabled={!canManage}
                                        />
                                        { canEdit && (question.values[defaultLanguage].length > 1) &&
                                            <button className={"delete-button"} type="button" 
                                                onClick={() => { this.deleteOption(index) }}>
                                                <Icon className="-small -theme-gray" name="icon-more"/>
                                            </button>
                                        }
                                    </div>
                                )
                            }
                            { isConditional && canEdit &&
                                <button 
                                    className={"c-button add-option-button"} 
                                    type="button" 
                                    onClick={this.onQuestionOptionAdd}
                                >
                                    <FormattedMessage id={"templates.addOption"} />
                                </button>
                            }
                            { isConditional &&
                            <div className="question-more-info">
                                <div className="conditional-settings">
                                    <Checkbox
                                        id={`${questionNum}-more-info`}
                                        callback={() => this.handleChangeMoreInfo(questionNum)}
                                        defaultChecked={question.childQuestions.length > 0}
                                        disabled={!canEdit}
                                    />
                                    <label className="text">{this.props.intl.formatMessage({ id: 'templates.moreInfoFirst' })}</label>
                                    <Select
                                        name="more-info-answer"
                                        className="more-info-select"
                                        options={conditionalOptions}
                                        value={question.childQuestions.length ? getSelectorValueFromArray(question.childQuestions[0].conditionalValue, conditionalOptions) : null}
                                        onChange={this.onMoreInfoSelect}
                                        searchable={false}
                                        clearable={false}
                                        placeholder={this.props.intl.formatMessage({ id: 'templates.selectCondition' })}
                                        noResultsText={this.props.intl.formatMessage({ id: 'templates.noConditions' })}
                                        arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
                                        disabled={!canEdit || !question.childQuestions.length}
                                    />
                                    <label className="text">{this.props.intl.formatMessage({ id: 'templates.moreInfoSecond' })}</label>
                                </div>
                                { question.childQuestions.length > 0 &&
                                    <input
                                        type="text"
                                        className="child-input -question"
                                        onChange={this.onChildInputChange}
                                        name="childquestion-label"
                                        value={question.childQuestions[0].label[defaultLanguage] || ''}
                                        placeholder={this.props.intl.formatMessage({ id: 'templates.childQuestionPlaceholder' })}
                                        onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                                        disabled={!canEdit}
                                    />
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="question-actions">
                    { canEdit && template.questions.length > 1 &&
                        <button 
                            className={"delete-button"} 
                            type="button" 
                            onClick={() => { deleteQuestion(questionNum)} }
                            disabled={!canEdit}
                        >
                            <Icon className="-small -gray" name="icon-delete"/>
                        </button>
                    }
                    <span className="required-label text -x-small-title">{this.props.intl.formatMessage({ id: 'templates.required' })}</span>
                    <SwitchButton
                        className="required"
                        name={`${questionNum}-required`} 
                        onChange={this.toggleRequired}
                        defaultChecked={question.required}
                        disabled={!canManage}
                    />
                </div>
            </div>
            { canSetConditional &&
                <div className="question-footer">
                    <Checkbox
                        id={`${questionNum}-only-show`}
                        callback={() => this.handleChangeOnlyShow(questionNum)}
                        defaultChecked={question.childQuestions.length > 0}
                        disabled={!canEdit}
                    />
                    <label className="text">{this.props.intl.formatMessage({ id: 'templates.onlyShow' })}</label>
                    <Select
                        name="only-show-question"
                        className="only-show-select"
                        options={conditionsQuestions}
                        value={question.conditions.length ? getSelectorValueFromArray(question.conditions[0].name, conditionsQuestions) : null}
                        onChange={this.onOnlyShowQuestionSelect}
                        searchable={false}
                        clearable={false}
                        placeholder={this.props.intl.formatMessage({ id: 'templates.selectQuestion' })}
                        arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
                        disabled={!question.conditions.length}
                    />
                    <label className="text">{this.props.intl.formatMessage({ id: 'templates.is' })}</label>
                    <Select
                        name="only-show-answer"
                        className="only-show-select"
                        options={conditionsAnswers}
                        value={question.conditions.length ? getSelectorValueFromArray(question.conditions[0].value, conditionsAnswers) : null}
                        onChange={this.onOnlyShowAnswerSelect}
                        searchable={false}
                        clearable={false}
                        placeholder={this.props.intl.formatMessage({ id: 'templates.selectOption' })}
                        arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
                        disabled={!question.conditions.length}
                    />
                </div>
            }
        </section>
    );
  }
}

QuestionCard.propTypes = {
    question: PropTypes.object.isRequired,
    questionNum: PropTypes.number.isRequired,
    defaultLanguage: PropTypes.string
};

export default injectIntl(QuestionCard);
