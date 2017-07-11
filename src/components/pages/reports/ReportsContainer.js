import { connect } from 'react-redux';
import moment from 'moment'
import { getReports, setSelectedTemplateIndex, setTemplateSearchParams, downloadAnswers } from '../../../modules/reports';

import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from '../../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import { filterData, getDataAreas } from '../../../helpers/filters';


const getAnswersByTemplate = (templateIndex, reports) => {
  const reportIds = reports.answers[templateIndex].ids;
  const reportData = reports.answers[templateIndex].data;
  let answers = reportIds.map((reportId) => ({
    id: reportData[reportId].id,
    date: moment(reportData[reportId].attributes.createdAt).format(DEFAULT_FORMAT),
    latLong: reportData[reportId].attributes.userPosition.toString(),
    member: reportData[reportId].attributes.user,
    aoi: reportData[reportId].attributes.areaOfInterest || null
  }));
  return answers;
}

const getTemplateOptions = (templates) => {
  const templateOptions = Object.keys(templates.data).map((key) => (
    { label: templates.data[key].attributes.name[DEFAULT_LANGUAGE] ?
             templates.data[key].attributes.name[DEFAULT_LANGUAGE] :
             templates.data[key].attributes.name[templates.data[key].attributes.defaultLanguage],
      value: templates.data[key].id
    }
  ));
  return templateOptions;
}

const mapStateToProps = ({ areas, templates, reports }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  const templateId = match.params.templateId || 0;
  let areasOptions = [];
  let answers = [];
  let templateOptions = [];
  let answersFiltered = [];
  if (templateId !== 0 && reports.answers[templateId]) {
    templateOptions = getTemplateOptions(templates);
    answers = getAnswersByTemplate(templateId, reports);
    areasOptions = getDataAreas(answers, areas);
    answersFiltered = filterData(answers, searchParams);
  }
  return {
    templateOptions,
    templates,
    answers: answersFiltered,
    areasOptions,
    reports,
    loadingTemplates: templates.loading,
    loadingReports: reports.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getReports: (id) => {
      dispatch(getReports(id));
    },
    setTemplateSearchParams: (queryParams) => {
      dispatch(setTemplateSearchParams(queryParams));
    },
    downloadAnswers: (templateIndex) => {
      dispatch(downloadAnswers(templateIndex));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
