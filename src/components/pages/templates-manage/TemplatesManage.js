import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Form } from '../../form/Form';
import Select from 'react-select';

class TemplatesManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedArea: this.props.selectedArea || '',
      defaultLanguage: this.props.selectedArea || ''
    }
  }

  onAreaChange = (selected) => {
    this.setState({selectedArea: selected});
  }

  onLanguageChange = (selected) => {
    this.setState({defaultLanguage: selected});
  }

  render() {
    const { areasOptions, languageOptions } = this.props;
    return (
      <div>
        <Hero
          title="templates.create"
        />
        <div className="l-template">
          <div className="template-meta">
            <Form onSubmit={this.handleSubmit}>
              <div className="c-form">
                <div className="row -main">
                  <div className="column small-12 medium-4 medium-offset-2">
                    <div className="input-group">
                      <label className="text"><FormattedMessage id={"templates.assignArea"} />:</label>
                      <Select
                        multi
                        simpleValue
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
                        multi
                        simpleValue
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
            </Form>
          </div>
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
