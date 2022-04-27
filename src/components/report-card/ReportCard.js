import { Component } from "react";
import PropTypes from "prop-types";
import { DEFAULT_LANGUAGE } from "../../constants/global";

import moment from "moment";

import Card from "../ui/Card";

class ReportCard extends Component {
  getFormatedDate = date => {
    return moment(date).format("DMMM HH:mm").toUpperCase();
  };

  render() {
    const { template, history } = this.props;
    return (
      <Card
        title={template.name[DEFAULT_LANGUAGE]} // TODO: Set browser language
        fields={[this.getFormatedDate(template.createdAt)]}
        actions={[
          {
            iconName: "icon-info",
            color: "-green",
            callback: () => history.push(`/templates/${template.id}`)
          }
        ]}
      />
    );
  }
}

ReportCard.propTypes = {
  template: PropTypes.object.isRequired,
  history: PropTypes.object
};

export default ReportCard;
