import { connect } from 'react-redux';
import moment from 'moment'
import { getReports, downloadAnswers } from '../../../modules/reports';

import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from '../../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import { filterData, getDataAreas } from '../../../helpers/filters';

const getLatLng = coords => coords
  .map(coord => parseFloat(coord).toFixed(5).toString())
  .join(', ');

const getTeamUser = (userId, team) => {
  const member = [...team.managers, ...team.confirmedUsers].find(member => member.id === userId);
  return member ? member.email : userId;
};

const getUser = (userId, id, team) => (userId === id ? 'me' : getTeamUser(userId, team));

const getAnswersByTemplate = (templateId, reports, areas, user, team) => {
  const reportIds = reports.answers[templateId].ids;
  const reportData = reports.answers[templateId].data;
  let answers = reportIds.map((reportId) => {
    const areaId = reportData[reportId].attributes.areaOfInterest;
    return {
      id: reportData[reportId].id,
      date: moment(reportData[reportId].attributes.createdAt).format(DEFAULT_FORMAT),
      latLong: getLatLng(reportData[reportId].attributes.userPosition),
      member: getUser(reportData[reportId].attributes.user, user.id, team),
      aoi: reportData[reportId].attributes.areaOfInterest || null,
      aoiName: areas.data[areaId] ? areas.data[areaId].attributes.name : null,
      reportName: reportData[reportId].attributes.reportName
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

const mapStateToProps = ({ areas, templates, reports, user, teams }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  const templateId = match.params.templateId || 0;
  let areasOptions = [];
  let answers = [];
  let templateOptions = [];
  let answersFiltered = [];
  if (templateId !== 0 && reports.answers[templateId]) {
    templateOptions = getTemplateOptions(templates);
    answers = getAnswersByTemplate(templateId, reports, areas, user.data, teams.data.attributes);
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
    loadingReports: reports.loading,
    searchParams: searchParams
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
