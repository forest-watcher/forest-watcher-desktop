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
        templates: state.templates,
        areasOptions,
        languageOptions
    }
};

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesManage);
