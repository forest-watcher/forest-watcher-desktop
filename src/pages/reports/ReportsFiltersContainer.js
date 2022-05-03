import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Filters from "./ReportsFilters";
import qs from "query-string";

const mapStateToProps = ({ reports, templates, app }, { match, location }) => {
  const templateId = match.params.templateId;
  const searchParams = qs.parse(location.search);
  return {
    templates,
    searchParams,
    templateId,
    locale: app.locale
  };
};

export default withRouter(connect(mapStateToProps)(Filters));
