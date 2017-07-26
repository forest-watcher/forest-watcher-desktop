import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import TemplatesFilters from './TemplatesFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import { TABLE_PAGE_SIZE } from '../../../constants/global';

class Templates extends React.Component {

  createTemplate = () => {
    const { history } = this.props;
    history.push('/templates/create');
  }

  handlePageChange = (page) => {
    const searchParams = Object.assign(this.props.searchParams, { page: page + 1 || undefined });
    this.props.history.push({
      pathname: `/templates`,
      search: qs.stringify(searchParams)
    });
  }

  render() {
    const { templates, searchParams } = this.props;
    const columns = [{
      Header: <FormattedMessage id="templates.title" />,
      accessor: 'title',
      Cell: props => <Link className="text" to={`/templates/${props.original.id}`}><span className='link'>{props.value}</span></Link>
    },{
      Header: <FormattedMessage id="reports.areaOfInterest" />,
      accessor: 'aoiName'
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
                  showPagination={templates.length > TABLE_PAGE_SIZE}
                  minRows={TABLE_PAGE_SIZE}
                  page={parseInt(searchParams.page, 10) - 1 || 0}
                  defaultPageSize={TABLE_PAGE_SIZE}
                  noDataText={this.props.intl.formatMessage({ id: 'templates.noTemplatesFound' })}
                  previousText=""
                  nextText=""
                  pageText=""
                  loadingText=""
                  onPageChange={(page) => {this.handlePageChange(page)}}
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
