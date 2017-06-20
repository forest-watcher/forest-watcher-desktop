import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_LANGUAGE } from '../../constants/global';

import fecha from 'fecha';

import Card from '../ui/Card';

class ReportCard extends React.Component {

  getFormatedDate = (date) => {
    return fecha.format(new Date(date), 'DMMM HH:mm').toUpperCase();
  }

  render() {
    const { report, history } = this.props;
    return (
      <Card
        title={report.name[DEFAULT_LANGUAGE]} // TODO: Set browser language
        fields={[this.getFormatedDate(report.createdAt)]}
        actions={[{
          iconName: 'icon-info',
          color: '-green',
          callback: () => history.push(`/templates/${report.id}`)
        }]}
      />
    );
  }
}

ReportCard.propTypes = {
  report: PropTypes.object.isRequired,
  history: PropTypes.object
};

export default ReportCard;
