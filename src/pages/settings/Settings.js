import { Component } from "react";
import PropTypes from "prop-types";

import Hero from "../../components/layouts/Hero";
import Article from "../../components/layouts/Article";
import TeamsShow from "../../components/teams-show/TeamsShowContainer";
import TeamsForm from "../../components/teams-manager/TeamsFormContainer";
import LayersManager from "../../components/layers-manager/LayersManager";
import LayersShow from "../../components/layers-show/LayersShow";
import Loader from "../../components/ui/Loader";
import Tab from "../../components/ui/Tab";
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
    const { team, editing, loading, saving, isManager, publicLayers, teamLayers, userLayers, setEditing } = this.props;

    const renderHero = () => {
      const canEdit = !editing && (isManager || this.state.tabIndex === 1);
      const tabStyle = !canEdit ? "-no-action" : "";
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
        >
          <Tab
            pill
            style={tabStyle}
            options={["settings.myTeam", "settings.layers"]}
            selectedIndex={this.state.tabIndex}
            handleTabIndexChange={this.handleTabIndexChange}
          />
        </Hero>
      );
    };

    return (
      <div>
        {renderHero()}
        <div className="l-content">
          {!loading && (
            <div>
              {team && !editing ? (
                <div className="settings-show">
                  <Article>
                    {this.state.tabIndex === 0 ? (
                      <TeamsShow />
                    ) : (
                      <LayersShow
                        isManager={isManager}
                        publicLayers={publicLayers}
                        teamLayers={teamLayers}
                        userLayers={userLayers}
                      />
                    )}
                  </Article>
                </div>
              ) : (
                <div className="settings-edit">
                  {this.state.tabIndex === 0 ? (
                    <TeamsForm setEditing={setEditing} editing={editing} team={team} />
                  ) : (
                    <LayersManager
                      editing={editing}
                      setEditing={setEditing}
                      isManager={isManager}
                      publicLayers={publicLayers}
                      teamLayers={teamLayers}
                      userLayers={userLayers}
                    />
                  )}
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
