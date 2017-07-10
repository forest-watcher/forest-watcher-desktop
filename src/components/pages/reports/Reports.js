import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import Filters from './ReportsFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';

class Reports extends React.Component {

  componentWillMount() {
    if (!this.props.match.params.templateIndex && this.props.templates.ids[0]) {
      this.props.history.push(`/reports/${this.props.templates.ids[0]}`);
    }
  }

  componentDidMount() {
    if (this.props.match.params.templateIndex) {
      this.props.getReportAnswers(this.props.match.params.templateIndex);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.templates.ids.length !== nextProps.templates.ids.length && !nextProps.match.params.templateIndex) {
      this.props.history.push(`/reports/${nextProps.templates.ids[0]}`);
    }
    if (nextProps.match.params.templateIndex !== this.props.match.params.templateIndex && 
        !nextProps.reports.answers[nextProps.match.params.templateIndex]) {
      this.props.getReportAnswers(nextProps.match.params.templateIndex);
    }
  }

  downloadReports = () => {
    this.props.downloadAnswers(this.props.match.params.templateIndex);
  }

  render() {
    const { answers } = this.props;
    const columns = [{
      Header: <FormattedMessage id="reports.latLng" />,
      accessor: 'latLong'
    },{
      Header: <FormattedMessage id="reports.areaOfInterest" />,
      accessor: 'aoi'
    },{  
      Header: <FormattedMessage id="reports.date" />,
      accessor: 'date'
    },{
      Header: <FormattedMessage id="reports.member" />,
      accessor: 'member'
    }]

    return (
      <div>
        <Hero
          title="reports.title"
          action={{name: "reports.downloadAnswers", callback: this.downloadReports}}
        />
          <div className="l-content">
            <Article>
              <Filters
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
                  minRows={5}
                  noDataText={this.props.intl.formatMessage({ id: 'reports.noReportsFound' })}
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
  templates: PropTypes.object.isRequired,
  getReportAnswers: PropTypes.func.isRequired
};

export default injectIntl(Reports);
