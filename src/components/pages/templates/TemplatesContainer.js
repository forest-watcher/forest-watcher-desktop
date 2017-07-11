import { connect } from 'react-redux';
import Templates from './Templates';
import { filterData, getDataAreas } from '../../../helpers/filters';
import qs from 'query-string';

const getTemplatesById = (templates, reports) => {
  const templateIds = templates.ids;
  let parsedTemplates = templateIds.map((templateId) => {
    const templateData = templates.data[templateId].attributes || null;
    return {
      id: templateId,
      title: templateData.name[templateData.defaultLanguage],
      defaultLanguage: templateData.defaultLanguage,
      aoi: templateData.areaOfInterest || null,
      count: templateData.answersCount || null
    };
  });
  return parsedTemplates;
}

const mapStateToProps = ({ templates, reports, areas }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  const parsedTemplates = getTemplatesById(templates, reports);
  const filteredTemplates = filterData(parsedTemplates, searchParams);
  const areasOptions = getDataAreas(parsedTemplates, areas);
  return {
    templates: filteredTemplates,
    areasOptions,
    loadingTemplates: templates.loading,
    loadingReports: reports.loading
  }
};

export default connect(mapStateToProps)(Templates);
