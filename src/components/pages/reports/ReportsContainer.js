import { connect } from 'react-redux';
import moment from 'moment'
import { getUserTemplates } from '../../../modules/templates';
import { getReportAnswers, setSelectedTemplateIndex, setTemplateSearchParams, downloadAnswers } from '../../../modules/reports';

import { DEFAULT_FORMAT } from '../../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import filterBy from '../../../helpers/filters';


const getAnswersByTemplate = (templateId, reports) => {
  const reportIds = reports.answers[templateId].ids;
  const reportData = reports.answers[templateId].data;
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
  const areasOptions = [];
  answers.forEach((answer) => {
    if (areas.ids.indexOf(answer.aoi) > -1 && areasOptions.indexOf(answer.aoi) === -1) {
      areasOptions.push({ label: areas.data[answer.aoi] && areas.data[answer.aoi].attributes.name, value: answer.aoi });
    }
  });
  return areasOptions;
}

const mapStateToProps = ({ areas, templates, reports }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  const { aoi, date, searchValues } = searchParams;
  const templateId = match.params.templateId || 0;
  let areasOptions = [];
  let answers = [];
  if (templateId !== 0 && reports.answers[templateId]) {
    answers = getAnswersByTemplate(templateId, reports);
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
    templates,
    answers,
    areasOptions,
    loading: templates.loading
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
    setSelectedTemplateIndex: (index) => {
      dispatch(setSelectedTemplateIndex(index));
    },
    setTemplateSearchParams: (queryParams) => {
      dispatch(setTemplateSearchParams(queryParams));
    },
    downloadAnswers: (templateId) => {
      dispatch(downloadAnswers(templateId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
