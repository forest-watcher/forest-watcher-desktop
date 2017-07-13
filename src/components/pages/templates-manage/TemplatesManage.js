import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Form, Input } from '../../form/Form';
import Select from 'react-select';
import Loader from '../../ui/Loader';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedArea: this.props.selectedArea || null,
      defaultLanguage: this.props.selectedArea || null
    }
    this.form = {
      title: props.template? props.template.name.en : null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.form = {
        ...this.form,
        title: nextProps.template !== null ? nextProps.template.name.en : ''
    };
  }

  onAreaChange = (selected) => {
    this.setState({selectedArea: selected});
  }

  onLanguageChange = (selected) => {
    this.setState({defaultLanguage: selected});
  }
  
  onInputChange = (e) => {
    this.form = Object.assign({}, this.form, { [e.target.name]: e.target.value }); 
  }

  render() {
    const { areasOptions, languageOptions, loading, mode } = this.props;
    return (
      <div>
        <Hero
          title={mode === 'manage' ? "template.manage" : "templates.create"}
        />
        <div className="l-template">
          { mode === 'manage' &&
            <Loader isLoading={loading} />
          }
          <Form onSubmit={this.handleSubmit}>
            <div className="c-form">
              <div className="template-meta">
                <div className="row">
                  <div className="column small-12 medium-4 medium-offset-2">
                    <div className="input-group">
                      <label className="text -gray"><FormattedMessage id={"templates.assignArea"} />:</label>
                      <Select
                        name="areas-select"
                        options={areasOptions}
                        value={this.state.selectedArea}
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
                        options={languageOptions}
                        value={this.state.defaultLanguage}
                        onChange={this.onLanguageChange}
                        noResultsText={this.props.intl.formatMessage({ id: 'filters.noLanguagesAvailable' })}
                        searchable={false}
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
                        value={this.form.title || ''}
                        placeholder={this.props.intl.formatMessage({ id: 'templates.title' })}
                        validations={['required']}
                      />
                    </div>
                  </div>
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
