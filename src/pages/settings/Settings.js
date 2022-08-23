import { Component } from "react";
import PropTypes from "prop-types";

import Hero from "components/layouts/Hero/Hero";
import LayersManager from "../../components/layers-manager/LayersManager";
import LayersShow from "../../components/layers-show/LayersShow";
import Loader from "../../components/ui/Loader";
import Confirm from "../../components/ui/Confirm";
import withModal from "../../components/ui/withModal";
import { injectIntl } from "react-intl";
import { CATEGORY, ACTION } from "../../constants/analytics";
import ReactGA from "react-ga";
import { FormattedMessage } from "react-intl";
import Button from "components/ui/Button/Button";

const ConfirmModal = withModal(Confirm);

class Settings extends Component {
  constructor() {
    super();
    this.firstLoad = true;
    this.state = {
      tabIndex: 0,
      tempTabIndex: 0,
      open: false
    };
  }

  UNSAFE_componentWillMount() {
    if (this.firstLoad) {
      this.props.getTeamByUserId(this.props.userId);
      this.props.getGFWLayers();
      this.props.getLayers();
      this.firstLoad = false;
    }
  }

  handleTabIndexChange = tabIndex => {
    if (this.props.editing) {
      this.setState({ tempTabIndex: tabIndex });
      this.setState({ open: true });
    } else {
      this.setState({ tabIndex });
    }
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  continueNav = () => {
    this.closeModal();
    this.props.setEditing(false);
    this.setState({ tabIndex: this.state.tempTabIndex });
  };

  editSettings = () => {
    this.props.setEditing(true);
    ReactGA.event({
      category: CATEGORY.SETTINGS,
      action: ACTION.EDIT_SETTINGS
    });
  };

  render() {
    const { editing, loading, saving, publicLayers, teamLayers, userLayers, setEditing } = this.props;

    const renderHero = () => {
      const canEdit = !editing;
      return (
        <Hero
          title={"settings.name"}
          actions={
            canEdit && (
              <Button onClick={this.editSettings}>
                <FormattedMessage id="common.edit" />
              </Button>
            )
          }
        ></Hero>
      );
    };

    return (
      <div>
        {renderHero()}
        <div className="l-content">
          {!loading && (
            <div>
              {!editing ? (
                <div className="settings-show">
                  <LayersShow publicLayers={publicLayers} teamLayers={teamLayers} userLayers={userLayers} />
                </div>
              ) : (
                <div className="settings-edit">
                  <LayersManager
                    editing={editing}
                    setEditing={setEditing}
                    publicLayers={publicLayers}
                    teamLayers={teamLayers}
                    userLayers={userLayers}
                  />
                </div>
              )}
              <Loader isLoading={saving} />
              <ConfirmModal
                open={this.state.open}
                title={this.props.intl.formatMessage({ id: "confirm.areYouSure" })}
                subtext={this.props.intl.formatMessage({ id: "confirm.continueNoSave" })}
                cancelText={this.props.intl.formatMessage({ id: "common.cancel" })}
                confirmText={this.props.intl.formatMessage({ id: "common.ok" })}
                onCancel={this.closeModal}
                close={this.closeModal}
                onAccept={this.continueNav}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  team: PropTypes.object,
  getTeamByUserId: PropTypes.func.isRequired,
  isManager: PropTypes.bool,
  publicLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array.isRequired,
  userLayers: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  intl: PropTypes.object
};

export default injectIntl(Settings);
