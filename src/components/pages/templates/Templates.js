import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import TemplatesFilters from './TemplateFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';

class Templates extends React.Component {

  createTemplate = () => {
    const { history } = this.props;
    history.push('/templates/create');
  }

  render() {
    const { templates } = this.props;
    const columns = [{
      Header: <FormattedMessage id="templates.title" />,
      accessor: 'title'
    },{
      Header: <FormattedMessage id="reports.areaOfInterest" />,
      accessor: 'aoi'
    },{  
      Header: <FormattedMessage id="templates.defaultLanguage" />,
      accessor: 'defaultLanguage'
    },{
      Header: <FormattedMessage id="templates.status" />,
      accessor: 'status'
    },{
      Header: <FormattedMessage id="templates.reportsSubmitted" />,
      accessor: 'count'
    }];
    const isLoading = this.props.loadingTemplates || this.props.loadingReports;
    return (
      <div>
        <Hero
          title="templates.title"
          action={{name: "templates.create", callback: this.createTemplate}}
        />
          <div className="l-content">
            <Article>
              <TemplatesFilters
                areasOptions={this.props.areasOptions}
              />
              <div className="l-loader">
                <ReactTable
                  className="c-table"
                  data={!isLoading && templates ? templates : []}
                  columns={columns}
                  showPageSizeOptions={false}
                  minRows={5}
                  noDataText={this.props.intl.formatMessage({ id: 'templates.noTemplatesFound' })}
                />
                <Loader isLoading={isLoading} />
              </div>
            </Article>
          </div>
      </div>
    );
  }
}

Templates.propTypes = {
  intl: PropTypes.object,
  loading: PropTypes.bool
};

export default injectIntl(Templates);
