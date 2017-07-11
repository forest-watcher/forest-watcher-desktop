import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import ReportsFilters from './ReportsFiltersContainer';
import Loader from '../../ui/Loader';
import { injectIntl } from 'react-intl';

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
    if (this.props.templates.ids.length !== nextProps.templates.ids.length && !nextProps.match.params.templateIndex) {
      this.props.history.push(`/reports/${nextProps.templates.ids[0]}`);
    }
    if (nextProps.match.params.templateId !== this.props.match.params.templateId && 
        !nextProps.reports.answers[nextProps.match.params.templateId]) {
      this.props.getReports(nextProps.match.params.templateId);
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
    }];

    return (
      <div>
        <Hero
          title="reports.title"
          action={{name: "reports.downloadAnswers", callback: this.downloadReports}}
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
  setSelectedTemplateIndex: PropTypes.func.isRequired
};

export default injectIntl(Reports);
