import React from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from '../../form/Form';
import Hero from '../../layouts/Hero';
import Select from 'react-select';
import MembersManager from './MembersManager';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MANAGER, USER, CONFIRMED_USER } from '../../../constants/global';

class TeamsForm extends React.Component {
  constructor (props) {
    super(props);
    const selectedManagers = (props.team && props.team.attributes.managers) || [];
    this.state = {
      selectedAreas: (props.team && props.team.attributes.areas.join()) || '',
      selectedUsers: (props.team && props.team.attributes.users) || [],
      selectedConfirmedUsers: (props.team && props.team.attributes.confirmedUsers) || [],
      selectedManagers,
      emailToSearch: ''
    }
    this.updateForm(props.team);
  }

  updateForm(team){
    this.form = {
      name: team && team.attributes.name,
      areas: (team && team.attributes.areas) || [],
      managers: (team && team.attributes.managers) || [],
      confirmedUsers: (team && team.attributes.confirmedUsers) || [],
      users: (team && team.attributes.users) || []
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.team !== nextProps.team) {
      this.updateForm(nextProps.team);
      if ( nextProps.team ) this.resetSelection(nextProps.team);
    }
  }

  resetSelection(team) {
    this.setState({ 
      selectedAreas: team.attributes.areas.join(),
      selectedManagers: team.attributes.managers,
      selectedConfirmedUsers: team.attributes.confirmedUsers || [],
      selectedUsers: team.attributes.users
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const team = this.props.team;
    if ((!team && this.form.users.length > 0) ||
         (team && (team.attributes.users !== this.form.users) && (team.attributes.users.lenght < this.form.users.lenght))) {
      this.props.sendNotifications();
    }
    if (this.form.name){
      (team) ? this.props.updateTeam(this.form, this.props.team.id) : this.props.createTeam(this.form);
    }
  }

  setEditing = (value) => {
    this.props.setEditing(value);
  }

  handleCancel = () => {
    this.resetSelection(this.props.team);
    this.setEditing(false) 
 }

  onInputChange = (e) => {
    this.form[e.target.name] = e.target.value;
  }

  onAreaChange = (selected) => {
    this.setState({selectedAreas: selected});
    this.form.areas = selected.split(',');
  }

  handleFormUpdate = (field, value) => {
    this.form[field] = value;
  }

  updateSelectedMembers = (selectedMembers, role) => {
    switch (role) {
      case MANAGER:
        this.setState({ selectedManagers: selectedMembers });
        this.form.managers = selectedMembers;    
        break;
      case CONFIRMED_USER:
        this.setState({ selectedConfirmedUsers: selectedMembers });
        this.form.confirmedUsers = selectedMembers;    
        break;
      case USER:
        this.setState({ selectedUsers: selectedMembers });
        this.form.users = selectedMembers;    
        break;
      default:
        break;
    }
  }

  render() {
    const { team, areaValues } = this.props;
    const title = this.props.team ? "teams.edit" : "teams.create";
    return (
      <div>
        <Hero
          title={title}
        />
        <Form onSubmit={this.handleSubmit}>
          <div className="c-form">
            <div className="row -main">
              <div className="small-6 columns">
                <div className="input-group">
                  <label className="text"><FormattedMessage id={"teams.teamName"} /></label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name || ''}
                    placeholder={this.props.intl.formatMessage({ id: 'teams.teamName' })}
                    validations={['required']}
                  />
                </div>
                <div className="input-group">
                  <label className="text"><FormattedMessage id={"teams.areas"} /></label>
                  <Select
                    multi
                    simpleValue
                    name="areas-select"
                    options={areaValues}
                    value={this.state.selectedAreas}
                    onChange={this.onAreaChange}
                    searchable={false}
                  />
                </div>
              </div>
              <MembersManager 
                updateSelectedMembers={this.updateSelectedMembers}
                selectedUsers={this.state.selectedUsers}
                selectedConfirmedUsers={this.state.selectedConfirmedUsers}
                selectedManagers={this.state.selectedManagers}
                addEmail={this.props.addEmail}
              />
            <div className="row small-12 columns">
              <div className="c-form -nav">
                { team &&
                  <div><button type="button" onClick={this.handleCancel} className="c-button -light"><FormattedMessage id={"common.cancel"} /></button></div>}
                <div><button type="submit" className="c-button -right"><FormattedMessage id={"common.save"} /></button></div>
              </div>
            </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

TeamsForm.propTypes = {
  team: PropTypes.object,
  areaValues: PropTypes.array.isRequired,
  sendNotifications: PropTypes.func.isRequired
};

export default injectIntl(TeamsForm);