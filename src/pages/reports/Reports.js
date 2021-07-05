import { useMemo, Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import { DEFAULT_FORMAT } from 'constants/global';

import Article from 'components/layouts/Article';
import Hero from 'components/layouts/Hero';
import ReactTable from 'react-table'
import { FormattedMessage } from 'react-intl';
import ReportsFilters from './ReportsFiltersContainer';
import Loader from 'components/ui/Loader';
import { injectIntl } from 'react-intl';
import qs from 'query-string';
import { TABLE_PAGE_SIZE } from 'constants/global';
import { CATEGORY, ACTION } from 'constants/analytics';
import ReactGA from 'react-ga';
import { getReportAlertsByName } from 'helpers/reports';

class Reports extends Component {
  constructor() {
    super();
    this.columns = [
      {
        Header: <FormattedMessage id="reports.reportPosition" />,
        accessor: 'reportedPosition',
        Cell: props => <span style={{ 'wordWrap': 'break-word', 'whiteSpace': 'normal' }} title={props.value}>{props.value}</span>
      },{
        Header: <FormattedMessage id="reports.userPosition" />,
        accessor: 'latLong',
        Cell: props => <span style={{ 'wordWrap': 'break-word', 'whiteSpace': 'normal' }} title={props.value}>{props.value}</span>
      },{
        Header: <FormattedMessage id="reports.reportName" />,
        accessor: 'reportName',
        Cell: props => <span style={{ 'wordWrap': 'break-word', 'whiteSpace': 'normal' }} title={props.value}>{props.value}</span>
      },{
        Header: <FormattedMessage id="reports.areaOfInterest" />,
        accessor: 'aoiName',
        Cell: props => <span style={{ 'wordWrap': 'break-word', 'whiteSpace': 'normal' }} title={props.value}>{props.value}</span>
      },{
        Header: <FormattedMessage id="reports.alertType" />,
        accessor: 'alertType',
        Cell: props => {
          // Fetch the alert type from the report name (current BED implementation does not have newer alert types)
          // Fallback onto actual alert type value if getReportAlertsByName comes back with nothing.
          const alertTypes = useMemo(() => getReportAlertsByName(props.original.reportName), [props.original.reportName]);
          return (
            <span style={{ 'wordWrap': 'break-word', 'whiteSpace': 'normal' }}>
              {alertTypes.length ?
                <ul>
                  {alertTypes.map(alert => <li key={alert.id}>{this.props.intl.formatMessage({ id: `layers.${alert.id}` })}</li>)}
                </ul>
                :
                this.props.intl.formatMessage({ id: `layers.${props.value}` })
              }
            </span>
          );
        }
      },{
        Header: <FormattedMessage id="reports.date" />,
        accessor: 'date',
        Cell: props => <span className='number'>{moment(props.value).format(DEFAULT_FORMAT)}</span>
      },{
        Header: <FormattedMessage id="reports.member" />,
        accessor: 'member'
      }
    ];
  }

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
    ReactGA.event({
      category: CATEGORY.REPORTS,
      action: ACTION.DOWNLOAD_REPORT_DATA
    });
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
                  columns={this.columns}
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
                  defaultSorted={[{
                    id   : 'date',
                    desc : true
                  }]}
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
