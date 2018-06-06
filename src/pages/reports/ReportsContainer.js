import { connect } from 'react-redux';
import { getReports, downloadAnswers } from '../../modules/reports';

import { DEFAULT_LANGUAGE } from '../../constants/global';
import qs from 'query-string';
import Reports from './Reports';
import { filterData, getDataAreas } from '../../helpers/filters';

const getLatLng = coords => coords
  .map(coord => parseFloat(coord).toFixed(6).toString())
  .join(', ');

const getTeamUser = (userId, team) => {
  if (!team) return userId;
  const member = [...team.managers, ...team.confirmedUsers].find(member => member.id === userId);
  return member ? member.email : userId;
};

const getUser = (userId, id, team) => (userId === id ? 'me' : getTeamUser(userId, team));

const getAnswersByTemplate = (templateId, reports, areas, user, team) => {
  const reportIds = reports.answers[templateId].ids;
  const reportData = reports.answers[templateId].data;

  let answers = reportIds.map((reportId) => {
    const report = reportData[reportId].attributes;
    const areaId = report.areaOfInterest;
    return {
      id: reportData[reportId].id,
      date: report.createdAt,
      latLong: getLatLng(report.userPosition),
      member: getUser(report.user, user.id, team),
      aoi: report.areaOfInterest || null,
      aoiName: areas.data[areaId] ? areas.data[areaId].attributes.name : report.areaOfInterestName,
      reportName: report.reportName,
      reportedPosition: getLatLng([report.clickedPosition[0].lat, report.clickedPosition[0].lon])
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
  const team = teams.data && teams.data.attributes;
  let areasOptions = [];
  let answers = [];
  let templateOptions = [];
  let answersFiltered = [];
  if (templateId !== 0 && reports.answers[templateId]) {
    templateOptions = getTemplateOptions(templates);
    answers = getAnswersByTemplate(templateId, reports, areas, user.data, team);
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
