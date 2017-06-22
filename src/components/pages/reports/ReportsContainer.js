 import { connect } from 'react-redux';
 import moment from 'moment'
 import { getUserTemplates, setSelectedTemplateIndex, setTemplateSearchParams } from '../../../modules/templates';
 import { getReportAnswers } from '../../../modules/reports';
 
 import Reports from './Reports';

  const mapStateToProps = ({ reports, templates }) => {
    const templateId = templates.ids[templates.selectedIndex];
    const search = templates.searchParams

    let answers = [];
    if (templateId !== undefined){
      const selectedAnswers = reports.answers[templateId];
      if (selectedAnswers !== undefined) {
        answers = selectedAnswers.map((answer) => ({
          id: answer.id,
          date: moment(answer.attributes.createdAt).format('DD/MM/YYYY'),
          latLong: answer.attributes.userPosition.toString(),
          member: answer.attributes.user,
          aoi: answer.attributes.layer // TODO: Change to AOI instead of layer
        }))
        if (search.aoi !== undefined){ 
          answers = answers.filter((answer) => answer.aoi === search.aoi)
        }
      }
    }
    return {
      templates,
      answers,
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
     }
   };
 }

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
