import { connect } from 'react-redux';
import Templates from './Templates';
import { filterData, getDataAreas } from '../../helpers/filters';
import qs from 'query-string';
import { LOCALES_LIST } from '../../constants/locales';

const getTemplatesById = (templates, reports, areas, user) => {
  const templateIds = templates.ids;
  let parsedTemplates = templateIds.map((templateId) => {
    const templateData = templates.data[templateId].attributes || null;
    let areaId = null;
    areas.ids.forEach((id) => {
      if (areas.data[id].attributes.templateId && areas.data[id].attributes.templateId === templateId) {
        areaId = id;
      }
    });
    const prettyLanguage = LOCALES_LIST.filter((lang) => {
      return lang.code === templateData.defaultLanguage;
    });
    return {
      id: templateId,
      title: templateData.name[templateData.defaultLanguage],
      defaultLanguage: templateData.defaultLanguage,
      defaultLanguageName: prettyLanguage[0].name,
      aoi: areaId,
      aoiName: areas.data[areaId] ? areas.data[areaId].attributes.name : null,
      count: templateData.answersCount || "-",
      status: templateData.status || null,
      user: templateData.user || null
    };
  });
  return parsedTemplates;
}

const mapStateToProps = ({ templates, reports, areas, user }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  const parsedTemplates = getTemplatesById(templates, reports, areas, user);
  const filteredTemplates = filterData(parsedTemplates, searchParams);
  const areasOptions = getDataAreas(parsedTemplates, areas);
  return {
    templates: filteredTemplates,
    areasOptions,
    loadingTemplates: templates.loading,
    loadingReports: reports.loading,
    searchParams: searchParams
  }
};

export default connect(mapStateToProps)(Templates);
