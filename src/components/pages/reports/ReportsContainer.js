 import { connect } from 'react-redux';
 import moment from 'moment'
 import { getUserReports } from '../../../modules/reports';
 import { getReportAnswers } from '../../../modules/data';
 import { DEFAULT_LANGUAGE } from '../../../constants/global';
 
 import Reports from './Reports';

  const mapStateToProps = ({ data, reports }) => {
    let answers = []
    Object.keys(data.answers).forEach((key) => {
      if (data.answers[key].length > 0){
        data.answers[key].forEach((answer) => {
          answers.push(
            {
              id: answer.id,
              date: moment(answer.attributes.createdAt).format('DD/MM/YYYY'),
              latLong: answer.attributes.userPosition.toString(),
              template: reports.report[key].attributes.name[DEFAULT_LANGUAGE] || 'Unknown',
              member: answer.attributes.user,
              aoi: 'aoi'
            }
          ); 
        });
      }
    })
    return {
      reports: reports,
      answers,
      loading: reports.loading
    };
  };
 
 function mapDispatchToProps(dispatch) {
   return {
     getUserReports: () => {
       dispatch(getUserReports());
    },
    getReportAnswers: (id) => {
      dispatch(getReportAnswers(id));
     }
   };
 }

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
