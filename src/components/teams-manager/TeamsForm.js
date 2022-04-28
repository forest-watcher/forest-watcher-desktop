import { Component } from "react";
import PropTypes from "prop-types";

import { Input, Form, Button } from "../form/Form";
import Select from "react-select";
import MembersManager from "./MembersManager";
import FormFooter from "../ui/FormFooter";
import { FormattedMessage, injectIntl } from "react-intl";
import { MANAGER, USER, CONFIRMED_USER } from "../../constants/global";
import { required } from "../../constants/validation-rules";
import DropdownIndicator from "../ui/SelectDropdownIndicator";

class TeamsForm extends Component {
  constructor(props) {
    super(props);
    const selectedManagers = (props.team && props.team.attributes.managers) || [];
    this.state = {
      selectedAreas: this.getSelectedAreas(),
      selectedUsers: (props.team && props.team.attributes.users) || [],
      selectedConfirmedUsers: (props.team && props.team.attributes.confirmedUsers) || [],
      selectedManagers,
      emailToSearch: ""
    };
    this.updateForm(props.team);
  }

  updateForm(team) {
    const updatedForm = {
      name: team && team.attributes.name,
      areas: (team && team.attributes.areas) || [],
      managers: (team && team.attributes.managers) || [],
      confirmedUsers: (team && team.attributes.confirmedUsers) || [],
      users: (team && team.attributes.users) || []
    };
    this.form = Object.assign({}, this.form, updatedForm);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.team !== nextProps.team) {
      this.updateForm(nextProps.team);
      if (nextProps.team) this.resetSelection(nextProps.team);
    }
  }

  componentWillUnmount() {
    this.props.setEditing(false);
  }

  resetSelection(team) {
    this.setState({
      selectedAreas: team.attributes.areas.join(),
      selectedManagers: team.attributes.managers,
      selectedConfirmedUsers: team.attributes.confirmedUsers || [],
      selectedUsers: team.attributes.users
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { team } = this.props;

    if (this.form.name) {
      team ? this.props.updateTeam(this.form, this.props.team.id) : this.props.createTeam(this.form);
    }
  };

  handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();
    this.resetSelection(this.props.team);
    this.props.setEditing(false);
  };

  onInputChange = e => {
    this.form = Object.assign({}, this.form, { [e.target.name]: e.target.value });
  };

  onAreaChange = selected => {
    this.setState({ selectedAreas: selected });
    const updatedAreas = [];
    for (let area in selected) {
      updatedAreas.push(selected[area].value);
    }
    this.form = Object.assign({}, this.form, { areas: updatedAreas });
  };

  handleFormUpdate = (field, value) => {
    this.form = Object.assign({}, this.form, { [field]: value });
  };

  getSelectedAreas = () => {
    if (this.props.team) {
      const selectedAreas = this.props.team.attributes.areas;
      return this.props.areaValues.filter(area => {
        return selectedAreas.find(selected => area.value === selected);
      });
    }

    return [];
  };

  updateSelectedMembers = (selectedMembers, role) => {
    switch (role) {
      case MANAGER:
        this.setState({ selectedManagers: selectedMembers });
        this.form = Object.assign({}, this.form, { managers: selectedMembers });
        break;
      case CONFIRMED_USER:
        this.setState({ selectedConfirmedUsers: selectedMembers });
        this.form = Object.assign({}, this.form, { confirmedUsers: selectedMembers });
        break;
      case USER:
        this.setState({ selectedUsers: selectedMembers });
        this.form = Object.assign({}, this.form, { users: selectedMembers });
        break;
      default:
        break;
    }
  };

  render() {
    const { areaValues, editing, addEmail, intl, loading } = this.props;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <div className="c-form">
            <div className="row">
              <div className="small-12 medium-5 columns">
                <div className="input-group">
                  <h3>
                    <label htmlFor="name">
                      <FormattedMessage id={"teams.teamName"} />
                    </label>
                  </h3>
                  <Input
                    id="name"
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name || ""}
                    placeholder={intl.formatMessage({ id: "teams.teamName" })}
                    validations={[required]}
                  />
                </div>
                <div className="input-group">
                  <h3>
                    <label htmlFor="areas-select">
                      <FormattedMessage id={"teams.areas"} />
                    </label>
                  </h3>
                  <Select
                    id="areas-select"
                    isMulti
                    className="c-select u-w-100"
                    classNamePrefix="Select"
                    name="areas-select"
                    options={areaValues}
                    value={this.state.selectedAreas}
                    onChange={this.onAreaChange}
                    noResultsText={intl.formatMessage({ id: "filters.noAreasAvailable" })}
                    isSearchable={false}
                    components={{ DropdownIndicator }}
                  />
                </div>
              </div>
              <MembersManager
                updateSelectedMembers={this.updateSelectedMembers}
                selectedUsers={this.state.selectedUsers}
                selectedConfirmedUsers={this.state.selectedConfirmedUsers}
                selectedManagers={this.state.selectedManagers}
                addEmail={addEmail}
                sendNotifications={this.props.sendNotifications}
              />
            </div>
            <FormFooter>
              {editing && (
                <button onClick={this.handleCancel} disabled={loading} className="c-button -light">
                  <FormattedMessage id="common.cancel" />
                </button>
              )}
              <Button disabled={loading} className="c-button -right">
                <FormattedMessage id="common.save" />
              </Button>
            </FormFooter>
          </div>
        </Form>
      </div>
    );
  }
}

TeamsForm.propTypes = {
  team: PropTypes.object,
  editing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
  areaValues: PropTypes.array.isRequired,
  sendNotifications: PropTypes.func.isRequired
};

export default injectIntl(TeamsForm);
