import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Confirm from '../../components/ui/Confirm';
import withModal from '../../components/ui/withModal';
import { injectIntl } from 'react-intl';
import ReactGA from 'react-ga';

const ConfirmModal = withModal(Confirm);

class AreaCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleAreaDelete = () => {
    this.setState({ open: false });
    const { area, deleteArea } = this.props;
    deleteArea(area.id);
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  render() {
    const { area, templates, user, intl } = this.props;
    return (
      <div className="c-area-card">
        <div className="area-content">
          <figure className="area-image" style={{ backgroundImage: `url(${area.image})`}}></figure>
          <div className="area-detail">
            <div className="area-title">
              <figcaption className="text -small-title">{area.name}</figcaption>
              { user.id === area.userId &&
                <div className="area-actions">
                  <Link className="c-button -circle -transparent" to={`/areas/${area.id}`}>
                    <Icon className="-small -gray" name="icon-edit"/>
                  </Link>
                  <button className="c-button -circle -transparent" onClick={this.openModal}>
                    <Icon className="-small -gray" name="icon-delete" />
                  </button>

                  <ConfirmModal
                    open={this.state.open}
                    subtext="subtext"
                    cancelText="cancelText"
                    confirmText="confirmText"
                    title={this.props.intl.formatMessage({ id: 'confirm.areYouSureDelete'})}
                    itemInformation={area.name}
                    subtext={this.props.intl.formatMessage({ id: 'confirm.deleteInformation'})}
                    cancelText={this.props.intl.formatMessage({ id: 'common.cancel'})}
                    confirmText={this.props.intl.formatMessage({ id: 'common.delete'})}
                    onCancel={this.closeModal}
                    close={this.closeModal}
                    onAccept={this.handleAreaDelete}
                  />
                </div>
              }
            </div>
            <ReactGA.OutboundLink
              eventLabel="Area - show report"
              to={`/reports/${templates.ids[0] || null}?aoi=${area.id || null}`}
              className="text -x-small-title -green"
              >
                <FormattedMessage id="areas.reportsBtn" />
            </ReactGA.OutboundLink>
          </div>
        </div>
      </div>
    );
  }
}

AreaCard.propTypes = {
  area: PropTypes.object.isRequired,
  deleteArea: PropTypes.func.isRequired,
  intl: PropTypes.object
};

export default injectIntl(AreaCard);
