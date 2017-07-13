import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Form, Input, Button } from '../../form/Form';
import Select from 'react-select';
import Loader from '../../ui/Loader';
import { getSelectorValueFromArray } from '../../../helpers/filters';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.template) this.setPropsToForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.template !== this.props.template) this.setPropsToForm(nextProps);
  }

  setPropsToForm = (props) => {
    this.setState({
      title: props.template.name.en || null,
      defaultLanguage: getSelectorValueFromArray(props.template.defaultLanguage, props.localeOptions) || null,
      aoi: getSelectorValueFromArray(props.template.areaOfInterest, props.areasOptions) || null
    });
  }

  onAreaChange = (selected) => {
    this.setState({ aoi: selected });
  }

  onLanguageChange = (selected) => {
    this.setState({ defaultLanguage: selected });
  }
  
  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.info(this.state);
    toastr.info('Submitted', 'Not currently implemented.');
  }

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
                  <div className="column small-12 medium-4 medium-offset-2">
                    <div className="input-group">
                      <label className="text -gray"><FormattedMessage id={"templates.assignArea"} />:</label>
                      <Select
                        name="areas-select"
                        options={areasOptions}
                        value={this.state.aoi}
                        onChange={this.onAreaChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noAreasAvailable' })}
                        searchable={false}
                      />
                    </div>
                  </div>
                  <div className="column small-12 medium-4">
                    <div className="input-group">
                      <label className="text"><FormattedMessage id={"templates.defaultLanguage"} />:</label>
                      <Select
                        name="language-select"
                        options={localeOptions}
                        value={this.state.defaultLanguage}
                        onChange={this.onLanguageChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noLanguagesAvailable' })}
                        searchable={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-fields">
                <div className="row">
                  <div className="column small-12 medium-8 medium-offset-2">
                    <div className="c-question -title">
                      <Input
                        type="text"
                        className="-title"
                        onChange={this.onInputChange}
                        name="title"
                        value={this.state.title || ''}
                        placeholder={this.props.intl.formatMessage({ id: 'templates.title' })}
                        validations={['required']}
                      />
                    </div>
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
