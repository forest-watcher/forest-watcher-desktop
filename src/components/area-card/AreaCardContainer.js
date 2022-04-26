import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AreaCard from "./AreaCard";
import { deleteArea } from "../../modules/areas";

const mapStateToProps = ({ areas, templates, user }, { id }) => {
  const area = areas.data[id] && areas.data[id].attributes;
  return {
    area: { ...area, id },
    templates,
    user: user.data
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteArea
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaCard);
