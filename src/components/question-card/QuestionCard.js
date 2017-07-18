import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../form/Form';
import { injectIntl } from 'react-intl';
import { prettyNum } from '../../helpers/utils';
import { QUESTION_OPTIONS } from '../../constants/templates';
import Select from 'react-select';

class QuestionCard extends React.Component {
  constructor (props) {
    super(props);
    this.question = { ...props.question };
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

  render() {
    const { question, questionNum, defaultLanguage } = this.props;
    return (
        <div className="c-question-card">
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
                />
                <Select
                    name="type"
                    className="type-select"
                    options={QUESTION_OPTIONS}
                    value={question.type}
                    onChange={this.onTypeChange}
                    searchable={false}
                    clearable={false}
                />
        </div>
    );
  }
}

QuestionCard.propTypes = {
    question: PropTypes.object.isRequired,
    questionNum: PropTypes.number.isRequired,
    defaultLanguage: PropTypes.string
};

export default injectIntl(QuestionCard);
