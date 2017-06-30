import React from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from '../../form/Form';
import Hero from '../../layouts/Hero';
import Select from 'react-select';
import Icon from '../../ui/Icon';

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

  handleAddUser = async () => {
    const email = this.state.emailToSearch;
    if (email) {
      const availableUser = await this.props.addEmail(email);
      if (availableUser) {
        this.form.selectedUsers.push(availableUser);
      }
    }
  }

  handleDeleteUser = (deletedUser) => {
    this.form.users = this.form.users.filter(user => user !== deletedUser);
    this.setState({ selectedUsers: this.form.users });
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
                <label className="text -x-small-title">Team name</label>
                <Input
                  type="text"
                  onChange={this.onInputChange}
                  name="name"
                  value={this.form.name || ''}
                  placeholder={"Team name"}
                  validations={['required']}
                />
                <label className="text -x-small-title">Associated Areas of Interest </label>
                <Select
                  multi
                  simpleValue
                  name="areas-select"
                  options={areaValues}
                  value={this.state.selectedAreas}
                  onChange={this.onAreaChange}
                />
              </div>
              <div className="small-6 columns">
                <label className="text -x-small-title">Members</label>
                <input
                  type="email"
                  onChange={(event) => this.setState({ emailToSearch: event.target.value})}
                  value={this.state.emailToSearch}
                  name="add-member"
                  placeholder={"Find by email"}
                />
                <button type="button" onClick={this.handleAddUser} className="c-button -light">Add</button>
                {this.form.managers && this.form.managers.map((manager, i) => (
                  <div key={i}> 
                    <div>
                      { manager }     
                      <input type="checkbox" id="admin" defaultChecked onChange={this.handleChangeAdmin}/>
                      <label htmlFor="admin">Admin</label>
                    </div>
                  </div>
                ))}
                {this.state.selectedUsers.map((user, i) => (
                  <div key={i}> 
                    <div>
                      { user }
                      <input type="checkbox" id="admin" onChange={this.handleChangeAdmin}/>
                      <label htmlFor="admin">Admin</label>
                      
                      <button type="button" onClick={() => this.handleDeleteUser(user)}>
                        <Icon name="icon-delete" className="-medium" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row small-12 columns">
                <div className="c-form -nav">
                  { team && <button type="button" onClick={this.handleCancel} className="c-button -light">Cancel</button> }
                  <button type="submit" className="c-button">Save</button>
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
