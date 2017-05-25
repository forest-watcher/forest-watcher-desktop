import React from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';

class ReportCard extends React.Component {

  render() {
    const { report } = this.props;
    return (
      <Card
        title={report.name}
        actions={[{ iconName: 'icon-info', color: '-green', callback: () => console.info('info report') }]}
      />
    );
  }
}

ReportCard.propTypes = {
  report: PropTypes.object.isRequired
};

export default ReportCard;
