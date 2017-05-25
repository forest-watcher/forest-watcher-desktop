import React from 'react';
import PropTypes from 'prop-types';

import fecha from 'fecha';

import Card from '../ui/Card';

class ReportCard extends React.Component {

  getFormatedDate = (date) => {
    return fecha.format(new Date(date), 'DMMM HH:mm').toUpperCase();
  }

  render() {
    const { report } = this.props;
    return (
      <Card
        title={report.name}
        fields={[this.getFormatedDate(report.createdAt)]}
        actions={[{
          iconName: 'icon-info',
          color: '-green',
          callback: () => console.info('info report')
        }]}
      />
    );
  }
}

ReportCard.propTypes = {
  report: PropTypes.object.isRequired
};

export default ReportCard;
