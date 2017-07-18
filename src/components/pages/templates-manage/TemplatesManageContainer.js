import { connect } from 'react-redux';

import TemplatesManage from './TemplatesManage';
import { LOCALES_LIST } from '../../../constants/locales';
import { TEMPLATE } from '../../../constants/templates';

const mapAreasToOptions = (areas) => {
    const areasOptions = [];
    const areasIds = areas.ids;
    areasIds.forEach((id) => {
        areasOptions.push({
            option: id,
            label: areas.data[id].attributes.name 
        });
    });
    return areasOptions;
};

const mapLocalesToOptions = (locales) => {
    const localeOptions = locales.map((locale) => {
        return {
            option: locale.code,
            label: locale.nativeName
        }
    });
    return localeOptions;
};

const mapStateToProps = (state, { match }) => {
    const areasOptions = mapAreasToOptions(state.areas);
    const templateId = match.params.templateId || null;
    const localeOptions = mapLocalesToOptions(LOCALES_LIST);
    const defaultTemplate = {
        ...TEMPLATE,
        name: {
            [state.app.locale]: ""       
        },
        languages: [state.app.locale],
        defaultLanguage: state.app.locale
    }
    return {
        mode: match.params.templateId ? 'manage' : 'create',
        template: state.templates.data[templateId] ? state.templates.data[templateId].attributes : defaultTemplate,
        loading: state.templates.loading,
        areasOptions,
        localeOptions
    }
};

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesManage);
