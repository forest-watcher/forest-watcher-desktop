import { connect } from 'react-redux';

import TemplatesManage from './TemplatesManage';

const mapStateToProps = (state, { match }) => ({
  templates: state.templates
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesManage);
