import { connect } from 'react-redux';
import { setEditing } from '../../modules/areas';

import DrawControl from './DrawControl';

const mapStateToProps = () => ({
});

function mapDispatchToProps(dispatch) {
  return {
    setEditing: (bool) => {
      dispatch(setEditing(bool));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawControl);
