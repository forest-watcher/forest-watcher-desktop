import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

class TemplatesManage extends React.Component {

  render() {
    const { templates } = this.props;
    return (
      <div>
        <Hero
          title="Create a template"
        />
          <div className="l-content">
            <Article>
              <div className="l-loader">
              </div>
            </Article>
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
