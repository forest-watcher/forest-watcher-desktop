 import { connect } from 'react-redux';
 import moment from 'moment'
 import { getUserTemplates } from '../../../modules/templates';
 import { getReportAnswers } from '../../../modules/reports';
 import { DEFAULT_LANGUAGE } from '../../../constants/global';
 
 import Reports from './Reports';

  const mapStateToProps = ({ reports, templates }) => {
    let answers = []
    Object.keys(reports.answers).forEach((key) => {
      if (reports.answers[key].length > 0){
        reports.answers[key].forEach((answer) => {
          answers.push(
            {
              id: answer.id,
              date: moment(answer.attributes.createdAt).format('DD/MM/YYYY'),
              latLong: answer.attributes.userPosition.toString(),
              template: templates.data[key].attributes.name[DEFAULT_LANGUAGE] || 'Unknown',
              member: answer.attributes.user,
              aoi: 'aoi'
            }
          ); 
        });
      }
    })
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
     }
   };
 }

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
