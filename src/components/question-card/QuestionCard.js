import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../form/Form';
import { injectIntl } from 'react-intl';
import { prettyNum } from '../../helpers/utils';
import Select from 'react-select';
import Icon from '../ui/Icon';
import SwitchButton from 'react-switch-button';

class QuestionCard extends React.Component {
  constructor (props) {
    super(props);
    this.question = { ...props.question };
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

  onTypeChange = (selected) => {
    this.question = { 
        ...this.question,
        type: selected.value 
    };
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

  render() {
    const { question, questionOptions, questionNum, defaultLanguage, deleteQuestion, status, mode } = this.props;
    const disabled = status === 'unpublished' && mode === 'create' ? false : true;
    return (
        <section className="c-question-card">
            <div className="questions">
            <span className="text -question-number">{prettyNum(questionNum)}.</span>
                <Input
                    type="text"
                    className="-question"
                    onChange={this.onInputChange}
                    name="label"
                    value={question.label[defaultLanguage] || ''}
                    placeholder={this.props.intl.formatMessage({ id: 'templates.questionPlaceholder' })}
                    validations={['required']}
                    onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                    disabled={disabled || mode === 'manage'}
                />
                <Select
                    name="type"
                    className="type-select"
                    options={questionOptions}
                    value={question.type}
                    onChange={this.onTypeChange}
                    searchable={false}
                    clearable={false}
                    disabled={disabled || mode === 'manage'}
                />
            </div>
            <div className="question-actions">
                { status === 'draft' &&
                    <button 
                        className={"delete-button"} 
                        type="button" 
                        onClick={() => { deleteQuestion(questionNum)} }
                        disabled={disabled || mode === 'manage' }
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
                    disabled={disabled || mode === 'manage' }
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
