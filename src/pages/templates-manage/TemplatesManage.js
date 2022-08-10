import { Component } from "react";
import PropTypes from "prop-types";

import Hero from "components/layouts/Hero/Hero";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form } from "../../components/form/Form";
import Select from "react-select";
import Loader from "../../components/ui/Loader";
import FormFooter from "../../components/ui/FormFooter";
import { getSelectorValueFromArray } from "../../helpers/filters";
import { setLanguages, syncLanguagesWithDefaultLanguage } from "../../helpers/languages";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import QuestionCard from "../../components/question-card/QuestionCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { QUESTION } from "../../constants/templates";
import Switch from "react-toggle-switch";
import DropdownIndicator from "../../components/ui/SelectDropdownIndicator";
import Banner from "../../components/ui/Banner";
import { CATEGORY, ACTION } from "../../constants/analytics";
import ReactGA from "react-ga";

import "react-toggle-switch/dist/css/switch.min.css";
import Button from "components/ui/Button/Button";

class TemplatesManage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canSubmit = true;
    this.urlParams = new URLSearchParams(props.location.search);
    this.backLink = this.urlParams.get("backTo") || "/templates";
  }

  ///////////////////////////////
  // life cycle
  ///////////////////////////////
  UNSAFE_componentWillMount() {
    if (this.props.template) this.setPropsToState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    if (nextProps.template !== this.props.template && this.props.mode === "manage") this.setPropsToState(nextProps);
    if (this.props.saving && !nextProps.saving && !nextProps.error) {
      history.push(this.backLink);
      toastr.success(this.props.intl.formatMessage({ id: "templates.saved" }));
    }
    if (nextProps.error) {
      toastr.error(this.props.intl.formatMessage({ id: "templates.errorSaving" }));
    }
    if (this.props.deleting && !nextProps.deleting && !nextProps.error) {
      history.push(this.backLink);
      toastr.info(this.props.intl.formatMessage({ id: "templates.deleted" }));
    }
    if (nextProps.error) {
      toastr.error(this.props.intl.formatMessage({ id: "templates.errorDeleting" }));
    }
  }

  ///////////////////////////////
  // sync state after fetch
  ///////////////////////////////
  setPropsToState = props => {
    const areaOfInterest = props.mode === "create" ? null : props.areaOfInterest;
    this.setState({
      ...props.template,
      areaOfInterest: areaOfInterest,
      oldAreaOfInterest: props.areaOfInterest
    });
  };

  ///////////////////////////////
  // handle global action -> validate state for empty strings, submit, delete
  ///////////////////////////////
  validateState = state => {
    // This function handles arrays and objects
    for (var field in state) {
      if (typeof state[field] === "string" && state[field] === "") {
        this.canSubmit = false;
      } else if (typeof state[field] === "object" && state[field] !== null) {
        // object but not one we want to change, start again
        this.validateState(state[field]);
      } else {
        // lets start again!
      }
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.validateState(this.state);
    if (this.canSubmit) {
      const method = this.props.mode === "manage" ? "PATCH" : "POST";
      this.props.saveTemplate(this.state, method, this.props.templateId);
      ReactGA.event({
        category: CATEGORY.TEMPLATES,
        action: ACTION.TEMPLATE_SAVE,
        label: "Template save success"
      });
    } else {
      toastr.error(
        this.props.intl.formatMessage({ id: "templates.missingFields" }),
        this.props.intl.formatMessage({ id: "templates.missingFieldsDetail" })
      );
      ReactGA.event({
        category: CATEGORY.TEMPLATES,
        action: ACTION.TEMPLATE_SAVE,
        label: "Template save failed - Missing fields"
      });
    }
    this.canSubmit = true;
  };

  deleteTemplate = () => {
    const aois = this.props.areaOfInterest !== null ? [this.props.areaOfInterest] : null;
    this.props.deleteTemplate(this.props.templateId, aois);
  };

  ///////////////////////////////
  // handle change of top level meta -> areas, defaultLanguage, title, status
  ///////////////////////////////
  onAreaChange = selected => {
    this.setState({ areaOfInterest: selected ? selected.option : null });
  };

  onLanguageChange = selected => {
    this.setState(setLanguages(selected.option, this.state));
    this.setState(syncLanguagesWithDefaultLanguage(selected.option, this.state));
    this.setState({
      defaultLanguage: selected.option
    });
  };

  onTitleChange = e => {
    this.setState({
      name: {
        ...this.state.name,
        [this.state.defaultLanguage]: e.target.value
      }
    });
  };

  toggleStatus = () => {
    const newStatus = this.state.status === "published" ? "unpublished" : "published";
    if (newStatus === "published") {
      ReactGA.event({
        category: CATEGORY.TEMPLATES,
        action: ACTION.PUBLISH_TEMPLATE,
        label: `Published ${this.state.questions.length} questions`
      });
    }
    this.setState({ status: newStatus });
  };

  ///////////////////////////////
  // handle question card changes with state -> edit, delete, add
  ///////////////////////////////
  handleQuestionEdit = (question, index) => {
    const newQuestions = this.state.questions.slice();
    newQuestions[index - 1] = question;

    this.setState({
      questions: newQuestions
    });
  };

  handleQuestionDelete = questionNum => {
    const removedQuestions = this.state.questions.slice();
    removedQuestions.splice(questionNum - 1, 1);

    this.setState({
      questions: removedQuestions
    });
  };

  handleQuestionAdd = e => {
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
  };

  ///////////////////////////////
  // consider it rendered
  ///////////////////////////////
  render() {
    const { areasOptions, localeOptions, questionOptions, loading, saving, deleting, mode, locale, user, template } =
      this.props;
    const canEdit =
      ((template.answersCount === 0 || !template.answersCount) &&
        (template.status === "unpublished" || template.status === "draft") &&
        user.id === template.user &&
        !template.public) ||
      mode === "create"
        ? true
        : false;
    const canManage = user.id === template.user || mode === "create" ? true : false;
    const modeCreate = mode === "create" ? true : false;
    const isPublic = template.public;
    const userCannotEditTemplate = isPublic || !canManage;
    const canSave = this.state.questions.length && this.state.name[this.state.defaultLanguage] ? true : false;
    const isLoading = loading || saving || deleting ? true : false;
    return (
      <div>
        <Hero
          title={mode === "manage" ? "templates.manage" : "templates.create"}
          actions={
            canEdit &&
            mode === "manage" && (
              <Button onClick={this.deleteTemplate}>
                <FormattedMessage id="templates.delete" />
              </Button>
            )
          }
        />
        <div className="l-template">
          <Loader isLoading={isLoading} />
          <Form onSubmit={this.onSubmit}>
            <div className="c-form -templates">
              <div className="template-meta">
                <div className="row">
                  {userCannotEditTemplate && (
                    <div className="column small-12 medium-10 large-8 medium-offset-1 large-offset-2">
                      <Banner title={this.props.intl.formatMessage({ id: "templates.cantEdit" })} />
                    </div>
                  )}

                  <div className="column small-12 medium-5 medium-offset-1 large-4 large-offset-2">
                    <div className="input-group">
                      <label htmlFor="areas-select" className="text -gray">
                        <FormattedMessage id={"templates.assignArea"} />:
                      </label>
                      <Select
                        id="areas-select"
                        name="areas-select"
                        className="c-select u-w-100"
                        classNamePrefix="Select"
                        options={areasOptions}
                        value={
                          this.state.areaOfInterest && areasOptions
                            ? getSelectorValueFromArray(this.state.areaOfInterest, areasOptions)
                            : null
                        }
                        onChange={this.onAreaChange}
                        noResultsText={this.props.intl.formatMessage({ id: "filters.noAreasAvailable" })}
                        isSearchable={false}
                        isDisabled={isLoading || userCannotEditTemplate}
                        components={{ DropdownIndicator }}
                      />
                    </div>
                  </div>
                  <div className="column small-12 medium-5 large-4">
                    <div className="input-group">
                      <label htmlFor="language-select" className="text">
                        <FormattedMessage id={"templates.defaultLanguage"} />:
                      </label>
                      <Select
                        id="language-select"
                        name="language-select"
                        className="c-select u-w-100"
                        classNamePrefix="Select"
                        options={localeOptions}
                        value={
                          this.state.defaultLanguage
                            ? getSelectorValueFromArray(this.state.defaultLanguage, localeOptions)
                            : locale
                        }
                        onChange={this.onLanguageChange}
                        noResultsText={this.props.intl.formatMessage({ id: "filters.noLanguagesAvailable" })}
                        isSearchable={true}
                        isClearable={false}
                        isDisabled={isLoading || !modeCreate || userCannotEditTemplate}
                        components={{ DropdownIndicator }}
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
                          value={this.state.name ? this.state.name[this.state.defaultLanguage] : ""}
                          placeholder={this.props.intl.formatMessage({ id: "templates.title" })}
                          onKeyPress={e => {
                            if (e.which === 13) {
                              e.preventDefault();
                            }
                          }} // Prevent send on press Enter
                          disabled={isLoading || userCannotEditTemplate}
                          required
                        />
                      </div>
                    </div>
                    {this.state.questions && (
                      <div>
                        {!userCannotEditTemplate && !modeCreate && (
                          <div className="u-margin-bottom">
                            <Banner title={this.props.intl.formatMessage({ id: "templates.cantEditQuestions" })} />
                          </div>
                        )}
                        <TransitionGroup>
                          {this.state.questions.map((question, index) => (
                            <CSSTransition key={index} classNames="fade" timeout={{ enter: 500, exit: 500 }}>
                              <QuestionCard
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
                            </CSSTransition>
                          ))}
                        </TransitionGroup>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="add-question">
              {modeCreate && (
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <div className="add-button">
                      <Button onClick={this.handleQuestionAdd} disabled={isLoading}>
                        <FormattedMessage id="templates.addQuestion" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <FormFooter>
              <Link to={this.backLink}>
                <Button variant="secondary" disabled={isLoading}>
                  <FormattedMessage id="forms.cancel" />
                </Button>
              </Link>
              <div className="template-status">
                <span className="status-label text -x-small-title">
                  {this.props.intl.formatMessage({ id: "templates.statusUnpublished" })}
                </span>
                <Switch
                  className="c-switcher"
                  onClick={this.toggleStatus}
                  on={this.state.status === "published"}
                  enabled={!isPublic && canManage && !isLoading}
                />
                <span className="status-label text -x-small-title">
                  {this.props.intl.formatMessage({ id: "templates.statusPublished" })}
                </span>
              </div>
              <Button disabled={isLoading || userCannotEditTemplate || !canSave}>
                <FormattedMessage id="forms.save" />
              </Button>
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
