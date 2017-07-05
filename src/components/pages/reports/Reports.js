import React from 'react';
import PropTypes from 'prop-types';

import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 
import ReactTable from 'react-table'
import 'react-select/dist/react-select.css';
import { FormattedMessage } from 'react-intl';
import Filters from './FiltersContainer';

class Reports extends React.Component {

  componentDidMount() {
    const reportIds = this.props.templates.ids;
    this.props.getReportAnswers(reportIds[this.props.match.params.templateIndex || 0]);
  }

  componentWillReceiveProps(nextProps){
    const nextTemplateIndex = nextProps.match.params.templateIndex;
    if (this.props.templates.ids.length !== nextProps.templates.ids.length || 
        this.props.match.params.templateIndex !== nextTemplateIndex) {
      this.props.getReportAnswers(nextProps.templates.ids[nextTemplateIndex || 0]);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.templates.ids.length !== nextProps.templates.ids.length || 
           this.props.match.params.templateIndex !== nextProps.match.params.templateIndex ||
           this.props.answers !== nextProps.answers || 
           this.props.location.search !== nextProps.location.search;
  }

  downloadReports = () => {
    const index = this.props.match.params.templateIndex || 0
    this.props.downloadAnswers(this.props.templates.ids[index]);
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
