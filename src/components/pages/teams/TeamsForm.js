import React from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from '../../form/Form';
import Hero from '../../layouts/Hero';
import Select from 'react-select';
import MembersManager from './MembersManager';

class TeamsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAreas: '',
      selectedUsers: [],
      emailToSearch: ''
    }
    this.updateForm(props.team);
  }

  updateForm(team){
    this.form = {
      name: team && team.attributes.name,
      areas: (team && team.attributes.areas) || [],
      managers: (team && team.attributes.managers) || [this.props.userId],
      users: (team && team.attributes.users) || []
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.team !== nextProps.team){
      this.updateForm(nextProps.team);
      if ( nextProps.team ) this.resetSelection(nextProps.team);
    }
  }

  resetSelection(team) {
    this.setState({ 
      selectedAreas: team.attributes.areas.join(),
      selectedUsers: team.attributes.users 
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.team ? this.props.updateTeam(this.form, this.props.team.id) : this.props.createTeam(this.form);
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

  updateSelectedUsers = (selectedUsers) => {
    this.setState({ selectedUsers })
    this.form.users = selectedUsers;
  }

  render() {
    const { team, areaValues } = this.props;
    const actionName = this.props.team ? 'Edit' : 'Create'
    return (
      <div>
        <Hero
          title={`${actionName} team`}
        />
        <Form onSubmit={this.handleSubmit}>
          <div className="c-form">
            <div className="row">
              <div className="small-6 columns">
                <div className="input-group">
                  <label className="text">Team name</label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name || ''}
                    placeholder={"Team name"}
                    validations={['required']}
                  />
                </div>
                <div className="input-group">
                  <label className="text">Associated Areas of Interest </label>
                  <Select
                    multi
                    simpleValue
                    name="areas-select"
                    options={areaValues}
                    value={this.state.selectedAreas}
                    onChange={this.onAreaChange}
                  />
                </div>
              </div>
              <MembersManager 
                updateSelectedUsers={this.updateSelectedUsers}
                selectedUsers={this.state.selectedUsers}
                form={this.form}
              />
              <div className="row small-12 columns">
                <div className="c-form -nav">
                  { team &&
                    <div><button type="button" onClick={this.handleCancel} className="c-button -light">Cancel</button></div>}
                  <div><button type="submit" className="c-button -right">Save</button></div>
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
  areaValues: PropTypes.array.isRequired
};

export default TeamsForm;
