import { connect } from 'react-redux';
import moment from 'moment'
import { getUserTemplates } from '../../../modules/templates';
import { getReportAnswers, setTemplateSearchParams, downloadAnswers } from '../../../modules/reports';

import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from '../../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import { filterBy } from '../../../helpers/filters';


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

const getAnswersAreas = (answers, areas) => {
  const areasIndex = [];
  const areasOptions = [];
  answers.forEach((answer) => {
    if (areas.ids.indexOf(answer.aoi) > -1 && areasIndex.indexOf(answer.aoi) === -1) {
      areasIndex.push(answer.aoi);
      areasOptions.push({ label: areas.data[answer.aoi] && areas.data[answer.aoi].attributes.name, value: answer.aoi });
    }
  });
  return areasOptions;
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
  const { aoi, date, searchValues } = searchParams;
  const templateIndex = match.params.templateIndex || 0;
  let areasOptions = [];
  let answers = [];
  let templateOptions = [];
  if (templateIndex !== 0 && reports.answers[templateIndex]) {
    templateOptions = getTemplateOptions(templates);
    answers = getAnswersByTemplate(templateIndex, reports);
    areasOptions = getAnswersAreas(answers, areas);
    if (aoi !== undefined){ 
      answers = filterBy(answers, 'aoi', aoi);
    }
    if (searchValues !== undefined){ 
      answers = filterBy(answers, 'search', searchValues);
    }
    if (date !== undefined){ 
      answers = filterBy(answers, 'date', date);
    }
  }
  return {
    templateOptions,
    templates,
    answers,
    areasOptions,
    reports,
    loadingTemplates: templates.loading,
    loadingReports: reports.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getUserTemplates: () => {
      dispatch(getUserTemplates());
    },
    getReportAnswers: (id) => {
      dispatch(getReportAnswers(id));
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
