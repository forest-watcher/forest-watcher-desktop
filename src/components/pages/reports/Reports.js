import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero';
import ReactTable from 'react-table'
import { FormattedMessage } from 'react-intl';
import ReportsFilters from './ReportsFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';
import qs from 'query-string';
import { TABLE_PAGE_SIZE } from '../../../constants/global';

import 'react-select/dist/react-select.css';


class Reports extends React.Component {

  componentWillMount() {
    if (!this.props.match.params.templateId && this.props.templates.ids[0]) {
      this.props.history.replace(`/reports/${this.props.templates.ids[0]}`);
    }
  }

  componentDidMount() {
    if (this.props.match.params.templateId) {
      this.props.getReports(this.props.match.params.templateId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.templates.ids.length !== nextProps.templates.ids.length && !nextProps.match.params.templateId) {
      this.props.history.push(`/reports/${nextProps.templates.ids[0]}`);
    }
    if (nextProps.match.params.templateId !== this.props.match.params.templateId &&
        !nextProps.reports.answers[nextProps.match.params.templateId]) {
      this.props.getReports(nextProps.match.params.templateId);
    }
  }

  downloadReports = () => {
    this.props.downloadAnswers(this.props.match.params.templateId);
  }

  handlePageChange = (page) => {
    const searchParams = Object.assign(this.props.searchParams, { page: page + 1 || undefined });
    this.props.history.push({
      pathname: `/reports/${this.props.match.params.templateId}`,
      search: qs.stringify(searchParams)
    });
  }

  render() {
    const { answers, searchParams } = this.props;

    const columns = [{
      Header: <FormattedMessage id="reports.latLng" />,
      accessor: 'latLong'
    },{
      Header: 'Report Name',
      accessor: 'reportName',
      Cell: props => <span style={{ 'word-wrap': 'break-word', 'white-space': 'normal' }} title={props.value}>{props.value}</span>
    },
      {
      Header: <FormattedMessage id="reports.areaOfInterest" />,
      accessor: 'aoiName'
    },{
      Header: <FormattedMessage id="reports.date" />,
      accessor: 'date',
      Cell: props => <span className='number'>{props.value}</span>
    },{
      Header: <FormattedMessage id="reports.member" />,
      accessor: 'member'
    }];

    return (
      <div>
        <Hero
          title="reports.title"
          action={answers.length ? {name: "reports.downloadAnswers", callback: this.downloadReports} : null}
        />
          <div className="l-content">
            <Article>
              <ReportsFilters
                answers={answers}
                areasOptions={this.props.areasOptions}
                templateOptions={this.props.templateOptions}
              />
              <div className="l-loader">
                <ReactTable
                  className="c-table"
                  data={answers || []}
                  columns={columns}
                  showPageSizeOptions={false}
                  showPagination={answers.length > TABLE_PAGE_SIZE}
                  minRows={TABLE_PAGE_SIZE}
                  defaultPageSize={TABLE_PAGE_SIZE}
                  page={parseInt(searchParams.page, 10) - 1 || 0}
                  noDataText={this.props.intl.formatMessage({ id: 'reports.noReportsFound' })}
                  previousText=""
                  nextText=""
                  pageText=""
                  loadingText=""
                  onPageChange={(page) => {this.handlePageChange(page)}}
                />
                <Loader isLoading={this.props.loadingTemplates || this.props.loadingReports} />
              </div>
            </Article>
          </div>
      </div>
    );
  }
}

Reports.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired
};

export default injectIntl(Reports);
