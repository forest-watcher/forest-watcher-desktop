import { connect } from 'react-redux';

import TemplatesManage from './TemplatesManage';
import { LOCALES_LIST } from '../../../constants/locales';
import { TEMPLATE, QUESTION_TYPES, QUESTION } from '../../../constants/templates';
import { saveTemplate, deleteTemplate } from '../../../modules/templates';

const mapAreasToOptions = (areas, templateId) => {
    const areasOptions = [];
    const areasIds = areas.ids;
    areasIds.forEach((id) => {
        if (!areas.data[id].attributes.templateId || areas.data[id].attributes.templateId === '' || templateId === areas.data[id].attributes.templateId) {
            areasOptions.push({
                option: id,
                label: areas.data[id].attributes.name 
            });
        }
    });
    return areasOptions;
};

const mapQuestionType = (questionTypes) => {
    const questionOptions = questionTypes.map((type) => {
        return {
            value: type,
            label: type
        }
    });
    return questionOptions;
}

const mapLocalesToOptions = (locales) => {
    const localeOptions = locales.map((locale) => {
        return {
            option: locale.code,
            label: locale.name
        }
    });
    return localeOptions;
};

const mapStateToProps = (state, { match }) => {
    const templateId = match.params.templateId || null;
    const localeOptions = mapLocalesToOptions(LOCALES_LIST);
    const questionOptions = mapQuestionType(QUESTION_TYPES);
    let areaOfInterest = null;
    state.areas.ids.forEach((areaId) => {
        if (state.areas.data[areaId].attributes.templateId === templateId) {
            areaOfInterest = areaId;
            return;
        } 
    });
    const areasOptions = mapAreasToOptions(state.areas, templateId);
    const defaultTemplate = {
        ...TEMPLATE,
        name: {
            [state.app.locale]: ""       
        },
        languages: [state.app.locale],
        defaultLanguage: state.app.locale,
        questions: [
            {
                ...QUESTION,
                order: 1,
                label: {
                    [state.app.locale]: ""
                },
                name: `question-1`
            }
        ]
    }
    return {
        templateId: match.params.templateId,
        areaOfInterest: areaOfInterest,
        mode: match.params.templateId ? 'manage' : 'create',
        template: state.templates.data[templateId] ? state.templates.data[templateId].attributes : defaultTemplate,
        loading: state.templates.loading,
        saving: state.templates.saving,
        deleting: state.templates.deleting,
        error: state.templates.error,
        areasOptions,
        localeOptions,
        questionOptions,
        user: state.user.data
    }
};

function mapDispatchToProps(dispatch) {
  return {
    saveTemplate: (template, method) => {
      dispatch(saveTemplate(template, method));
    },
    deleteTemplate: (templateId, aois) => {
      dispatch(deleteTemplate(templateId, aois));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesManage);
