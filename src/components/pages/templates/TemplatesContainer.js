import { connect } from 'react-redux';
import Templates from './Templates';

const getTemplatesById = (templates, reports) => {
  const templateIds = templates.ids;
  let parsedTemplates = templateIds.map((templateId) => {
    const templateData = templates.data[templateId].attributes || null;
    return {
      id: templateId,
      title: templateData.name[templateData.defaultLanguage],
      defaultLanguage: templateData.defaultLanguage,
      aoi: templateData.areaOfInterest || null,
      numOfReports: reports.answers[templateId] ? reports.answers[templateId].ids.length : null
    };
  });
  return parsedTemplates;
}

const mapStateToProps = ({ templates, reports }) => {
  const parsedTemplates = getTemplatesById(templates, reports);
  return {
    templates: parsedTemplates,
    loading: templates.loading
  }
};

export default connect(mapStateToProps)(Templates);
