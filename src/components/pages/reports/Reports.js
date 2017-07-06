import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import Filters from './FiltersContainer';

class Reports extends React.Component {

  componentWillMount() {
    if (!this.props.match.params.templateId && this.props.templates.ids[0]) {
      this.props.history.push(`/reports/${this.props.templates.ids[0]}`);
    }
  }

  componentDidMount() {
    if (this.props.match.params.templateId) {
      this.props.getReportAnswers(this.props.match.params.templateId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.templates.ids.length !== nextProps.templates.ids.length) {
      if (!nextProps.match.params.templateId) {
        this.props.history.push(`/reports/${nextProps.templates.ids[0]}`);
        this.props.getReportAnswers(nextProps.templates.ids[0]);
      } else {
        this.props.getReportAnswers(nextProps.match.params.templateId);
      }
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return this.props.templates.ids.length !== nextProps.templates.ids.length || 
  //          this.props.match.params.templateId !== nextProps.match.params.templateId ||
  //          this.props.answers !== nextProps.answers || 
  //          this.props.location.search !== nextProps.location.search;
  // }

  downloadReports = () => {
    this.props.downloadAnswers(this.props.match.params.templateId);
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
              />
              <ReactTable
                className="c-table"
                data={answers || []}
                columns={columns}
                showPageSizeOptions={false}
                minRows={5}
              />
            </Article>
          </div>
      </div>
    );
  }
}

Reports.propTypes = {
  answers: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  getReportAnswers: PropTypes.func.isRequired,
  setSelectedTemplateIndex: PropTypes.func.isRequired
};

export default Reports;
