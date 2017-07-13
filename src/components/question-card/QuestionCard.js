import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../form/Form';
import { injectIntl } from 'react-intl';
import { prettyNum } from '../../helpers/utils';

class QuestionCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = props.question;
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.props.syncStateWithProps(this.state);
  }

  render() {
    const { question, questionNum, defaultLanguage } = this.props;
    return (
        <div className="c-question-card">
            <span className="text -question-number">{prettyNum(questionNum)}.</span>
                <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="label"
                    value={question.label[defaultLanguage.option] || ''}
                    placeholder={this.props.intl.formatMessage({ id: 'templates.questionPlaceholder' })}
                    validations={['required']}
                />
        </div>
    );
  }
}

QuestionCard.propTypes = {
    question: PropTypes.object.isRequired,
    questionNum: PropTypes.number.isRequired,
    defaultLanguage: PropTypes.object
};

export default injectIntl(QuestionCard);
