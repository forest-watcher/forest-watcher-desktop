import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input, Button } from '../../form/Form';
import Select from 'react-select';
import Loader from '../../ui/Loader';
import FormFooter from '../../ui/FormFooter';
import { getSelectorValueFromArray } from '../../../helpers/filters';
import { setLanguages, syncLanguagesWithDefaultLanguage } from '../../../helpers/languages';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import QuestionCard from '../../question-card/QuestionCard';
import { CSSTransitionGroup } from 'react-transition-group';
import { QUESTION } from '../../../constants/templates';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // Lifecycle
  componentWillMount() {
    if (this.props.template) this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    if (nextProps.template !== this.props.template && this.props.mode === 'manage') this.setPropsToState(nextProps);
    if (this.props.saving && !nextProps.saving) {
      history.push('/templates');      
      toastr.success(this.props.intl.formatMessage({ id: 'templates.saved' }));
    }
  }


  // Setters
  setPropsToState = (props) => {
    this.setState({ ...props.template });
  }
  

  // Actions to update state
  onAreaChange = (selected) => {
    this.setState({ areaOfInterest: selected ? selected.option : null });
  }

  onLanguageChange = (selected) => {
    this.setState(setLanguages(selected.option, this.state));
    this.setState(syncLanguagesWithDefaultLanguage(selected.option, this.state));
    this.setState({
      defaultLanguage: selected.option
    });
  }
  
  onInputChange = (e) => {
    this.setState({
      name: {
        ...this.state.name,
        [this.state.defaultLanguage]: e.target.value
      }
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const method = this.props.mode === 'manage' ? 'PATCH' : 'POST';
    this.props.saveTemplate(this.state, method);
  }

  
  // Question management
  handleQuestionEdit = (question, index) => {
    const newQuestions = this.state.questions.slice();
    newQuestions[index - 1] = question;

    this.setState({
      questions: newQuestions
    });
  }

  handleQuestionDelete = (questionNum) => {
    const removedQuestions = this.state.questions.slice();
    removedQuestions.splice(questionNum - 1, 1);
    
    this.setState({
      questions: removedQuestions
    });
  }

  handleAddQuestion = (e) => {
    e.preventDefault();
    const newQuestions = this.state.questions.slice();
    newQuestions[newQuestions.length] = {
      ...QUESTION,
      order: newQuestions.length,
      label: {
        [this.state.defaultLanguage]: ""
      },
      name: `question-${newQuestions.length + 1}`
    };

    this.setState({
      questions: newQuestions
    });
  }


  // Render
  render() {
    const { areasOptions, localeOptions, loading, saving, mode, locale } = this.props;
    return (
      <div>
        <Hero
          title={mode === 'manage' ? "templates.manage" : "templates.create"}
        />
        <div className="l-template">
          <Loader isLoading={loading || saving} />
          <Form onSubmit={this.onSubmit}>
            <div className="c-form -templates">
              <div className="template-meta">
                <div className="row">
                  <div className="column small-12 medium-5 medium-offset-1 large-4 large-offset-2">
                    <div className="input-group">
                      <label className="text -gray"><FormattedMessage id={"templates.assignArea"} />:</label>
                      <Select
                        name="areas-select"
                        className="c-select"
                        options={areasOptions}
                        value={this.state.areaOfInterest && areasOptions ? getSelectorValueFromArray(this.state.areaOfInterest, areasOptions) : null}
                        onChange={this.onAreaChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noAreasAvailable' })}
                        searchable={false}
                        disabled={saving || loading || mode === 'manage'}
                      />
                    </div>
                  </div>
                  <div className="column small-12 medium-5 large-4">
                    <div className="input-group">
                      <label className="text"><FormattedMessage id={"templates.defaultLanguage"} />:</label>
                      <Select
                        name="language-select"
                        className="c-select"
                        options={localeOptions}
                        value={this.state.defaultLanguage ? getSelectorValueFromArray(this.state.defaultLanguage, localeOptions) : locale}
                        onChange={this.onLanguageChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noLanguagesAvailable' })}
                        searchable={true}
                        clearable={false}
                        disabled={saving || loading || mode === 'manage'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-fields">
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <div className="c-question-card -title">
                      <Input
                        type="text"
                        className="-title"
                        onChange={this.onInputChange}
                        name="name"
                        value={this.state.name ? this.state.name[this.state.defaultLanguage] : ''}
                        placeholder={this.props.intl.formatMessage({ id: 'templates.title' })}
                        validations={['required']}
                        onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                        disabled={saving || loading || mode === 'manage'}
                      />
                    </div>
                      {this.state.questions &&
                        <CSSTransitionGroup
                          transitionName="example"
                          transitionEnterTimeout={500}
                          transitionLeaveTimeout={500}
                        >
                          { this.state.questions.map((question, index) =>
                            <QuestionCard 
                              key={index} 
                              questionNum={index + 1} 
                              question={question} 
                              syncStateWithProps={this.handleQuestionEdit} 
                              defaultLanguage={this.state.defaultLanguage}
                              deleteQuestion={this.handleQuestionDelete}
                              status={this.state.status}
                              mode={mode}
                            />
                          )}
                        </CSSTransitionGroup>
                      }
                  </div>
                </div>
              </div>
            </div>
            { (this.state.status === 'draft' || mode === 'create') &&
              <div className="add-question">
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <div className="add-button">
                      <button className="c-button" onClick={this.handleAddQuestion} disabled={saving || loading || mode === 'manage'}><FormattedMessage id="templates.addQuestion" /></button>
                    </div>
                  </div>
                </div>
              </div>
            }
            <FormFooter>
              <Link to="/templates">
                <button className="c-button -light" disabled={saving || loading}><FormattedMessage id="forms.cancel" /></button>
              </Link>
              <Button className="c-button" disabled={saving || loading || mode === 'manage'}><FormattedMessage id="forms.save" /></Button>
            </FormFooter>
          </Form>
        </div>
      </div>
    );
  }
}

TemplatesManage.propTypes = {
  intl: PropTypes.object,
  loading: PropTypes.bool
};

export default injectIntl(TemplatesManage);
