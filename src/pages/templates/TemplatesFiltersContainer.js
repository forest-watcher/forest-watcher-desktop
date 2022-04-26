import { connect } from "react-redux";
import { withRouter } from "react-router";
import Filters from "./TemplatesFilters";
import qs from "query-string";

const mapStateToProps = ({ templates, app }, { match, location }) => {
  const searchParams = qs.parse(location.search);
  return {
    templates,
    searchParams,
    locale: app.locale
  };
};

export default withRouter(connect(mapStateToProps)(Filters));
