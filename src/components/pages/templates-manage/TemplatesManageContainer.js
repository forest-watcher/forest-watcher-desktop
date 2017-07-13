import { connect } from 'react-redux';

import TemplatesManage from './TemplatesManage';

const mapAreasToOptions = (areas) => {
    const areasOptions = [];
    const areasIds = areas.ids;
    areasIds.forEach((id) => {
        areasOptions.push({
            option: id,
            label: areas.data[id].attributes.name 
        });
    })
    return areasOptions;
};

const mapStateToProps = (state, { match }) => {
    const areasOptions = mapAreasToOptions(state.areas);
    const templateId = match.params.templateId || null;
    const languageOptions = [
        {
            option: 'en',
            label: 'English'
        },
        {
            option: 'es',
            label: 'Espanol'
        }
    ];
    return {
        mode: match.params.templateId ? 'manage' : 'create',
        template: state.templates.data[templateId]? state.templates.data[templateId].attributes : null,
        areasOptions,
        loading: state.templates.loading,
        languageOptions
    }
};

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesManage);
