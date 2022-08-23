import { Component } from "react";
import PropTypes from "prop-types";

import { FormattedMessage } from "react-intl";
import Tab from "../ui/Tab";
import { includes } from "../../helpers/utils";
import Checkbox from "../ui/Checkbox";
import { toastr } from "react-redux-toastr";
import { injectIntl } from "react-intl";
import { MAX_NUMBER_OF_LAYERS } from "../../constants/global";
import CustomLayers from "./CustomLayers";
import { CATEGORY, ACTION } from "../../constants/analytics";

import ReactGA from "react-ga";

class LayersForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      GFWLayers: props.GFWLayers || [],
      teamMode: false,
      form: {
        title: null,
        tileurl: null,
        style: null
      }
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.GFWLayers !== nextProps.GFWLayers) {
      this.setState({
        GFWLayers: nextProps.GFWLayers
      });
    }
  }

  getLayerName(name) {
    if (name.match(/^layers\./) !== null) {
      return <FormattedMessage id={name} />;
    }
    return name;
  }

  backwardsCompatLayerTitle(name) {
    if (name.match(/^layers\./) !== null) {
      return name.split("layers.")[1];
    }
    return name;
  }

  handleTabIndexChange = tabIndex => {
    this.setState({ tabIndex });
  };

  toggleGFWLayer = GFWLayer => {
    const GFWLayers = [].concat(this.state.GFWLayers);
    GFWLayers.map(stateGFWlayer => {
      if (stateGFWlayer.cartodb_id === GFWLayer.cartodb_id) {
        stateGFWlayer.enabled = !stateGFWlayer.enabled;
      }
      return stateGFWlayer;
    });
    this.setState({ GFWLayers });
  };

  resetForm = () => {
    const form = Object.assign(
      {},
      {
        title: "",
        tileurl: "",
        style: ""
      }
    );
    this.setState({ form });
  };

  maxLayers = (GFWLayer, teamId, userLayerLength, teamLayerLength) => {
    return (teamId && teamLayerLength > MAX_NUMBER_OF_LAYERS) || (!teamId && userLayerLength > MAX_NUMBER_OF_LAYERS);
  };

  alreadyExist = (GFWLayer, teamId, userLayerNames, teamLayerNames) => {
    return (
      (teamId && includes(teamLayerNames, this.backwardsCompatLayerTitle(GFWLayer.title))) ||
      (!teamId && includes(userLayerNames, this.backwardsCompatLayerTitle(GFWLayer.title)))
    );
  };

  addLayers = e => {
    e.preventDefault();
    const teamId = this.state.teamMode ? this.props.team.id : null;
    const typeOfLayer = teamId ? "settings.teamLayers" : "settings.userLayers";
    const userLayerNames = this.props.userLayers.map(selectedLayer => selectedLayer.attributes.name);
    const teamLayerNames = this.props.teamLayers.map(selectedLayer => selectedLayer.attributes.name);
    let userLayerLength = userLayerNames.length;
    let teamLayerLength = teamLayerNames.length;

    if (this.state.tabIndex === 0) {
      // GFW Layers
      const resetedLayers = this.state.GFWLayers.map(GFWLayer => {
        if (
          GFWLayer.enabled &&
          this.addLayer(GFWLayer, teamId, userLayerNames, teamLayerNames, userLayerLength, teamLayerLength, typeOfLayer)
        ) {
          // Prevents the user from adding several layers on a batch that exceeds the limit
          teamId ? (teamLayerLength += 1) : (userLayerLength += 1);
          GFWLayer.enabled = false;
          ReactGA.event({
            category: CATEGORY.CONTEXTUAL_LAYERS,
            action: ACTION.ADD_GFW_LAYER,
            label: "Add GFW Layer Success"
          });
        }
        return GFWLayer;
      });
      this.setState({ GFWLayers: resetedLayers });
    } else {
      // Custom Layers
      if (
        this.addLayer(
          this.state.form,
          teamId,
          userLayerNames,
          teamLayerNames,
          userLayerLength,
          teamLayerLength,
          typeOfLayer
        )
      ) {
        ReactGA.event({
          category: CATEGORY.CONTEXTUAL_LAYERS,
          action: ACTION.ADD_CUSTOM_LAYER,
          label: "Add custom layer success"
        });
        this.resetForm();
      } else {
        toastr.error(this.props.intl.formatMessage({ id: "settings.validationError" }));
        ReactGA.event({
          category: CATEGORY.CONTEXTUAL_LAYERS,
          action: ACTION.ADD_CUSTOM_LAYER,
          label: "Add custom layer - Validation error"
        });
      }
    }
  };

  addLayer = (layer, teamId, userLayerNames, teamLayerNames, userLayerLength, teamLayerLength, typeOfLayer) => {
    if (this.maxLayers(layer, teamId, userLayerLength, teamLayerLength)) {
      toastr.error(
        this.props.intl.formatMessage({ id: "settings.maxNumberLayers" }),
        this.props.intl.formatMessage({ id: typeOfLayer })
      );
      return false;
    }
    if (this.alreadyExist(layer, teamId, userLayerNames, teamLayerNames)) {
      toastr.error(this.props.intl.formatMessage({ id: "settings.layerAlreadyExists" }), layer.title);
      return false;
    }
    this.props.createLayer(layer, teamId);
    return true;
  };

  onInputChange = e => {
    const form = { ...this.state.form, [e.target.name]: e.target.value };
    this.setState({ form });
  };

  render() {
    return (
      <div className="c-layers-form">
        <div className="form-header">
          <h3>
            <FormattedMessage id={"settings.contextualLayers"} />
          </h3>
          <Tab
            options={["settings.gfwLayers"]}
            selectedIndex={this.state.tabIndex}
            handleTabIndexChange={this.handleTabIndexChange}
          />
        </div>
        <form onSubmit={e => this.addLayers(e)} ref={f => (this.formNode = f)}>
          {this.state.tabIndex === 0 ? (
            this.state.GFWLayers &&
            this.state.GFWLayers.map((GFWlayer, i) => (
              <Checkbox
                classNames="-spaced"
                key={`${i}${GFWlayer.cartodb_id}`}
                id={`${i}${GFWlayer.cartodb_id}`}
                label={this.getLayerName(GFWlayer.title)}
                callback={() => this.toggleGFWLayer(GFWlayer)}
                checked={GFWlayer.enabled || false}
              />
            ))
          ) : (
            <CustomLayers form={this.state.form} onInputChange={this.onInputChange} />
          )}
          <div className="layer-add">
            {this.props.team && (
              <Checkbox
                id={"gfw-teams-add"}
                labelId={this.props.intl.formatMessage({ id: "settings.addToTeam" })}
                callback={() => this.setState({ teamMode: !this.state.teamMode })}
              />
            )}
            <button className="c-button c-button--secondary -right">
              <FormattedMessage id="common.add" />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

LayersForm.propTypes = {
  userLayers: PropTypes.array.isRequired,
  teamLayers: PropTypes.array,
  publicLayers: PropTypes.array.isRequired,
  GFWLayers: PropTypes.array.isRequired,
  team: PropTypes.object,
  createLayer: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(LayersForm);
