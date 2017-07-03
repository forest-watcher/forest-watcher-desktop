import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../ui/Icon';
import Checkbox from '../../ui/Checkbox';

class MembersManager extends React.Component {
  constructor() {
    super();
    this.state = {
      emailToSearch: ''
    }
  }

  handleAddEmail = async () => {
    const email = this.state.emailToSearch;
    if (email) {
      const availableUser = await this.props.addEmail(email);
      if (availableUser) {
        const updatedUsers = this.props.selectedUsers;
        updatedUsers.push(availableUser);
        this.props.updateSelectedUsers(updatedUsers);
      }
    }
  }

  deleteUser = (deletedUser) => {
    const updatedUsers = this.props.selectedUsers.filter(user => user !== deletedUser);
    this.props.updateSelectedUsers(updatedUsers);
  }

  addUser = (user) => {
    const updatedUsers = this.props.selectedUsers;
    updatedUsers.push(user);
    this.props.updateSelectedUsers(updatedUsers);
  }

  deleteManager = (deletedManager) => {
    const updatedManagers = this.props.selectedManagers.filter(manager => manager !== deletedManager);
    this.props.updateSelectedManagers(updatedManagers);
  }

  addManager = (manager) => {
    const updatedManagers = this.props.selectedManagers;
    updatedManagers.push(manager);
    this.props.updateSelectedManagers(updatedManagers);
  }

  handleChangeRole = (member, toAdmin) => {
    if (toAdmin){
      this.addManager(member);
      this.deleteUser(member);
    } else {
      this.addUser(member);
      this.deleteManager(member);
    }
  }

  render() {
    const { selectedUsers, selectedManagers } = this.props;
    return (
      <div className="small-6 columns">
        <div className="input-group">
          <label htmlFor="add-member" className="text">Members</label>
          <div className="horizontal-field-left">
            <input
              type="email"
              onChange={(event) => this.setState({ emailToSearch: event.target.value})}
              value={this.state.emailToSearch}
              name="add-member"
              placeholder={"Find by email"}
            />
            <button type="button" onClick={this.handleAddEmail} className="c-button -light">Add</button>
          </div>
          {selectedManagers.map((manager) => (
            <div key={manager} className="horizontal-field-left">
              <div className="user-label">{ manager }</div>
              <Checkbox id={`admin${manager}`} label={"Admin"} callback={() => this.handleChangeRole(manager, false)} defaultChecked={true}/>
              <button className="delete-button hidden" type="button">
                <Icon name="icon-delete" className="-medium" />
              </button>
            </div>
          ))}
          {selectedUsers.map((user) => (
            <div key={user} className="horizontal-field-left"> 
              <div className="user-label">{ user }</div>
              <Checkbox id={`user${user}`} label={"Admin"} callback={() => this.handleChangeRole(user, true)} />
              <button className="delete-button" type="button" onClick={() => this.deleteUser(user)}>
                <Icon name="icon-delete" className="-medium" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

MembersManager.propTypes = {
  selectedManagers: PropTypes.array.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  updateSelectedUsers: PropTypes.func.isRequired
};

export default MembersManager;