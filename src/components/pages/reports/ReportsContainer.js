 import { connect } from 'react-redux';
 import moment from 'moment'
 import { getUserTemplates } from '../../../modules/templates';
 import { setSelectedTemplateIndex, setTemplateSearchParams, downloadAnswers } from '../../../modules/reports';
 import { getReportAnswers } from '../../../modules/reports';
 import { DEFAULT_FORMAT } from '../../../constants/global';
 
 import qs from 'query-string';
 import Reports from './Reports';

  const filterBy = (field, answers, value) => {
    switch (field) {
      case 'aoi':
        return answers.filter((answer) => answer.aoi === value);
      case 'date':
        return answers.filter((answer) => answer.date === value);
      case 'search':
        return answers.filter((answer) => {
          return Object.keys(answer).some((key) => {
            if(answer[key].toLowerCase().includes(value.toLowerCase())) return true;
            return false;
          })
        })
      default:
        break;
    }
    return answers.filter((answer) => answer.aoi === value);
  }

  const mapStateToProps = ({ reports, templates }, { match, location }) => {    
    const templateId = templates.ids[match.params.templateIndex];
    const searchParams = qs.parse(location.search);
    const { aoi, date, searchValues } = searchParams;
    let answers = [];
    if (templateId !== undefined){
      const selectedAnswers = reports.answers[templateId];
      if (selectedAnswers !== undefined) {
        answers = selectedAnswers.map((answer) => ({
          id: answer.id,
          date: moment(answer.attributes.createdAt).format(DEFAULT_FORMAT),
          latLong: answer.attributes.userPosition.toString(),
          member: answer.attributes.user,
          aoi: answer.attributes.layer // TODO: Change to AOI instead of layer
        }))
        if (aoi !== undefined){ 
          answers = filterBy('aoi', answers, aoi);
        }
        if (searchValues !== undefined){ 
          answers = filterBy('search', answers, searchValues);
        }
        if (date !== undefined){ 
          answers = filterBy('date', answers, date);
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
     },
    downloadAnswers: (templateId) => {
      dispatch(downloadAnswers(templateId));
    }
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
