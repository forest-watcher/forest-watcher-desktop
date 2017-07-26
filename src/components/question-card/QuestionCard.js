import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { prettyNum } from '../../helpers/utils';
import { getSelectorValueFromArray } from '../../helpers/filters';
import Select from 'react-select';
import Icon from '../ui/Icon';
import SwitchButton from 'react-switch-button';
import Checkbox from '../ui/Checkbox';
import { CHILD_QUESTION } from '../../constants/templates';

class QuestionCard extends React.Component {
  constructor (props) {
    super(props);
    this.question = { ...props.question };
    this.inputs = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question !== this.props.question) {
        this.question = { ...nextProps.question };
    }
  }

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

  onTypeChange = (selected) => {
    if (selected.value === 'radio' || selected.value === 'select' || selected.value === 'checkbox') {
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

  toggleRequired = () => {
    let required = this.question.required;
    required = required ? false : true;
    this.question = {
        ...this.question,
        required: required
    };
    this.props.syncStateWithProps(this.question, this.props.questionNum);
  }

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

  render() {
    const { template, question, questionOptions, questionNum, defaultLanguage, deleteQuestion, canEdit, canManage } = this.props;
    const isConditional = question.type === 'radio' || question.type === 'select' || question.type === 'checkbox' ? true : false;
    const conditionalOptions = [];
    if (question.values && question.values[defaultLanguage]) {
        question.values[defaultLanguage].forEach((value) => {
            conditionalOptions.push({
                option: value.value,
                label: value.label
            });
        });
    }
    return (
        <section className="c-question-card">
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
