import { connect } from 'react-redux';
import moment from 'moment'
import { getReports, downloadAnswers } from '../../../modules/reports';

import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from '../../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import { filterData, getDataAreas } from '../../../helpers/filters';


const getAnswersByTemplate = (templateId, reports, areas) => {
  const reportIds = reports.answers[templateId].ids;
  const reportData = reports.answers[templateId].data;
  let answers = reportIds.map((reportId) => {
    const areaId = reportData[reportId].attributes.areaOfInterest;
    return {
      id: reportData[reportId].id,
      date: moment(reportData[reportId].attributes.createdAt).format(DEFAULT_FORMAT),
      latLong: reportData[reportId].attributes.userPosition.toString(),
      member: reportData[reportId].attributes.user,
      aoi: reportData[reportId].attributes.areaOfInterest || null,
      aoiName: areas.data[areaId] ? areas.data[areaId].attributes.name : null
    }
  });
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
    answers = getAnswersByTemplate(templateId, reports, areas);
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
    downloadAnswers: (templateId) => {
      dispatch(downloadAnswers(templateId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
