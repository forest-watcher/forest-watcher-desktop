import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input, Button } from '../../form/Form';
import Select from 'react-select';
import Loader from '../../ui/Loader';
import { getSelectorValueFromArray } from '../../../helpers/filters';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import QuestionCard from '../../question-card/QuestionCard';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // Lifecycle
  componentDidMount() {
    if (this.props.template) this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.template !== this.props.template) this.setPropsToState(nextProps);
  }


  // Setters
  setPropsToState = (props) => {
    this.setState({ ...props.template });
  }

  // Actions to update state
  onAreaChange = (selected) => {
    this.setState({ areaOfInterest: selected.option });
  }

  setLanguages = (selected) => {
    const activeLanguages = this.state.languages;
    activeLanguages.indexOf(selected) === -1 &&
      activeLanguages.push(selected);
    const index = activeLanguages.indexOf(this.state.defaultLanguage);
    if (index > -1) {
      activeLanguages.splice(index, 1);
    }
    return activeLanguages;
  }

  syncLanguagesWithDefault = (newLanguage) => {
    let state = { ...this.state };
    const currentLanguage = this.state.defaultLanguage;
    const keys = ['name'];
    keys.forEach((key) => {
      const obj = { ...this.state[key] };
      obj[newLanguage] = obj[currentLanguage];
      delete obj[currentLanguage];
      state = {
        ...this.state,
        [key]: obj
      }
    });
    this.setState(state);
  }

  onLanguageChange = (selected) => {
    this.setLanguages(selected.option);
    this.syncLanguagesWithDefault(selected.option);
    this.setState({
      defaultLanguage: selected.option
    });
  }
  
  onInputChange = (e) => {
    const name = Object.assign({}, this.state.name);
    name[this.state.defaultLanguage] = e.target.value;
    this.setState({
      name
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.info(this.state);
    toastr.info('Submitted', 'Not currently implemented.');
  }

  handleQuestionEdit = (question) => {
    // this.setState(question);
  }


  // Render
  render() {
    const { areasOptions, localeOptions, loading, mode } = this.props;
    return (
      <div>
        <Hero
          title={mode === 'manage' ? "templates.manage" : "templates.create"}
        />
        <div className="l-template">
          { mode === 'manage' &&
            <Loader isLoading={loading} />
          }
          <Form onSubmit={this.onSubmit}>
            <div className="c-form">
              <div className="template-meta">
                <div className="row">
                  <div className="column small-12 medium-5 medium-offset-1 large-4 large-offset-2">
                    <div className="input-group">
                      <label className="text -gray"><FormattedMessage id={"templates.assignArea"} />:</label>
                      <Select
                        name="areas-select"
                        options={areasOptions}
                        value={this.state.areaOfInterest && areasOptions ? getSelectorValueFromArray(this.state.areaOfInterest, areasOptions) : null}
                        onChange={this.onAreaChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noAreasAvailable' })}
                        searchable={false}
                      />
                    </div>
                  </div>
                  <div className="column small-12 medium-5 large-4">
                    <div className="input-group">
                      <label className="text"><FormattedMessage id={"templates.defaultLanguage"} />:</label>
                      <Select
                        name="language-select"
                        options={localeOptions}
                        value={this.state.defaultLanguage ? getSelectorValueFromArray(this.state.defaultLanguage, localeOptions) : null}
                        onChange={this.onLanguageChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noLanguagesAvailable' })}
                        searchable={true}
                        clearable={false}
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
                      />
                    </div>
                    {this.state.questions &&
                      this.state.questions.map((question, index) =>
                        {/*<QuestionCard 
                          key={index} 
                          questionNum={index + 1} 
                          question={question} 
                          syncStateWithProps={this.handleQuestionEdit} 
                          defaultLanguage={this.state.defaultLanguage}
                        />*/}
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="c-form-footer">
              <div className="row column">
                <div className="container">
                  <Link to="/templates">
                    <button className="c-button -light" disabled={this.props.saving || this.props.loading}><FormattedMessage id="forms.cancel" /></button>
                  </Link>
                  <Button className="c-button" disabled={this.props.saving || (this.props.editing ? true : false) || this.props.loading}><FormattedMessage id="forms.save" /></Button>
                </div>
              </div>
            </div>
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
