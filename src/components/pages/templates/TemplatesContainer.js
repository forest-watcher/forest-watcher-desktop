import { connect } from 'react-redux';
import { getUserTemplates } from '../../../modules/templates';

import Templates from './Templates';

const mapStateToProps = ({ templates }) => ({
  templateIds: templates.ids,
  loading: templates.loading
});

function mapDispatchToProps(dispatch) {
  return {
    getUserTemplates: () => {
      dispatch(getUserTemplates());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Templates);
