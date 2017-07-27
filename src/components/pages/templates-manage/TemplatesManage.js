import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from '../../form/Form';
import { validation } from '../../../helpers/validation'; // eslint-disable-line no-unused-vars
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
import SwitchButton from 'react-switch-button';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.canSubmit = true;
  }

  ///////////////////////////////
  // life cycle
  ///////////////////////////////
  componentWillMount() {
    if (this.props.template) this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    if (nextProps.template !== this.props.template && this.props.mode === 'manage') this.setPropsToState(nextProps);
    if (this.props.saving && !nextProps.saving && !nextProps.error) {
      history.push('/templates');
      toastr.success(this.props.intl.formatMessage({ id: 'templates.saved' }));
    }
    if (nextProps.error) {
      toastr.error(this.props.intl.formatMessage({ id: 'templates.errorSaving' }));
    }
    if (this.props.deleting && !nextProps.deleting && !nextProps.error) {
      history.push('/templates');
      toastr.info(this.props.intl.formatMessage({ id: 'templates.deleted' }));
    }
    if (nextProps.error) {
      toastr.error(this.props.intl.formatMessage({ id: 'templates.errorDeleting' }));
    }
  }


  ///////////////////////////////
  // sync state after fetch
  ///////////////////////////////
  setPropsToState = (props) => {
    this.setState({ ...props.template, areaOfInterest: props.areaOfInterest });
  }


  ///////////////////////////////
  // handle global action -> validate state for empty strings, submit, delete
  ///////////////////////////////
  validateState = (state) => {
    // This function handles arrays and objects
    for (var field in state) {
      if (typeof state[field] === 'string' && state[field] === '') {
        this.canSubmit = false;
      } else if (typeof state[field] === 'object' && state[field] !== null) {
        // object but not one we want to change, start again
        this.validateState(state[field]);
      } else {
        // lets start again!
      }
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.validateState(this.state);
    if (this.canSubmit) {
      const method = this.props.mode === 'manage' ? 'PATCH' : 'POST';
      this.props.saveTemplate(this.state, method);
    } else {
      toastr.error(this.props.intl.formatMessage({ id: 'templates.missingFields' }), this.props.intl.formatMessage({ id: 'templates.missingFieldsDetail' }));      
    }
    this.canSubmit = true;
  }

  deleteTemplate = () => {
    const aois = null;
    this.props.deleteTemplate(this.props.templateId, aois);
  }


  ///////////////////////////////
  // handle change of top level meta -> areas, defaultLanguage, title, status
  ///////////////////////////////
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
  
  onTitleChange = (e) => {
    this.setState({
      name: {
        ...this.state.name,
        [this.state.defaultLanguage]: e.target.value
      }
    });
  }

  toggleStatus = () => {
    const newStatus = this.state.status === 'published' ? 'unpublished' : 'published';
    this.setState({ status: newStatus });
  }

  
  ///////////////////////////////
  // handle question card changes with state -> edit, delete, add
  ///////////////////////////////
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

  handleQuestionAdd = (e) => {
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


  ///////////////////////////////
  // consider it rendered
  ///////////////////////////////
  render() {
    const { areasOptions, localeOptions, questionOptions, loading, saving, deleting, mode, locale, user, template } = this.props;
    const canEdit = ((template.answersCount === 0 || !template.answersCount) && (template.status === 'unpublished' || template.status === 'draft') && user.id === this.state.user) || mode === 'create' ? true : false;
    const canManage = user.id === this.state.user || mode === 'create' ? true : false;
    const canSave = this.state.questions.length && this.state.name[this.state.defaultLanguage] ? true : false;
    const isLoading = loading || saving || deleting ? true : false;
    // console.log(this.state);
    return (
      <div>
        <Hero
          title={mode === 'manage' ? "templates.manage" : "templates.create"}
          action={canEdit && mode === 'manage' ? {name: "templates.delete", callback: this.deleteTemplate} : null}
        />
        <div className="l-template">
          <Loader isLoading={isLoading} />
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
                        disabled={isLoading || !canManage}
                        arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
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
                        disabled={isLoading || !canManage}
                        arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-fields">
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <div className="c-question-card">
                      <div className="question-card -title">
                        <input
                          type="text"
                          className="-title"
                          onChange={this.onTitleChange}
                          name="name"
                          value={this.state.name ? this.state.name[this.state.defaultLanguage] : ''}
                          placeholder={this.props.intl.formatMessage({ id: 'templates.title' })}
                          onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
                          disabled={isLoading}
                        />
                      </div>
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
                              template={this.state}
                              syncStateWithProps={this.handleQuestionEdit}
                              questionOptions={questionOptions}
                              defaultLanguage={this.state.defaultLanguage}
                              deleteQuestion={this.handleQuestionDelete}
                              status={this.state.status}
                              canEdit={canEdit}
                              canManage={canManage}
                              mode={mode}
                            />
                          )}
                        </CSSTransitionGroup>
                      }
                  </div>
                </div>
              </div>
            </div>
            <div className="add-question">
              { canEdit &&
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <div className="add-button">
                      <button 
                        className="c-button" 
                        onClick={this.handleQuestionAdd} 
                        disabled={isLoading}
                      >
                        <FormattedMessage id="templates.addQuestion" />
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
            <FormFooter>
              <Link to="/templates">
                <button className="c-button -light" disabled={isLoading}><FormattedMessage id="forms.cancel" /></button>
              </Link>
              <div className="template-status">
                <span className="status-label text -x-small-title">{this.props.intl.formatMessage({ id: 'templates.statusUnpublished' })}</span>
                <SwitchButton
                  className="status"
                  name={'status'} 
                  onChange={this.toggleStatus}
                  defaultChecked={this.state.status === 'published' ? true : false}
                  disabled={isLoading || !canManage}
                />
                <span className="status-label text -x-small-title">{this.props.intl.formatMessage({ id: 'templates.statusPublished' })}</span>
              </div>
              <Button className="c-button" disabled={isLoading || !canSave}><FormattedMessage id="forms.save" /></Button>                
            </FormFooter>
          </Form>
        </div>
      </div>
    );
  }
}

TemplatesManage.propTypes = {
  intl: PropTypes.object,
  loading: PropTypes.bool,
  saving: PropTypes.bool,
  error: PropTypes.bool
};

export default injectIntl(TemplatesManage);
