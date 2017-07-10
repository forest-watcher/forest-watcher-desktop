import { connect } from 'react-redux';
import Templates from './Templates';
import { getTemplates } from '../../../modules/templates';

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

const mapStateToProps = ({ templates, reports }) => {
  const parsedTemplates = getTemplatesById(templates, reports);
  return {
    templates: parsedTemplates,
    loadingTemplates: templates.loading,
    loadingReports: reports.loading
  }
};

export default connect(mapStateToProps)(Templates);
