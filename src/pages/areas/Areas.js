import * as React from "react";
import PropTypes from "prop-types";
import Hero from "../../components/layouts/Hero";
import Article from "../../components/layouts/Article";
import GridGallery from "../../components/layouts/GridGallery";
import AreaCard from "../../components/area-card/AreaCardContainer";
import Icon from "../../components/ui/Icon";
import { FormattedMessage } from "react-intl";
import Loader from "../../components/ui/Loader";
import { trimQueryParams } from "../../helpers/login.js";
import ReactGA from "react-ga";

class Areas extends React.Component {
  componentWillMount() {
    trimQueryParams(this.props);
  }

  getAddArea = () => {
    if (this.props.loading) return null;
    return (
      <ReactGA.OutboundLink eventLabel="Add new area" to="/areas/create">
        <button className="c-add-card">
          <Icon name="icon-plus" className="-medium -green" />
          <span className="text -x-small-title -green">
            <FormattedMessage id="areas.addArea" />
          </span>
        </button>
      </ReactGA.OutboundLink>
    );
  };

  render() {
    const { areasList } = this.props;
    return (
      <div>
        <Hero title="areas.title" />
        <div className="l-content">
          <Article title="areas.subtitle">
            <GridGallery
              collection={areasList}
              className="area-card-item"
              columns={{ small: 12, medium: 4, large: 3 }}
              Component={AreaCard}
              after={this.getAddArea()}
            />
            <Loader isLoading={this.props.loading} />
          </Article>
        </div>
      </div>
    );
  }
}

Areas.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  areasList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Areas;
