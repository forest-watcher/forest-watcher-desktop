import React from 'react';
import PropTypes from 'prop-types';
import MemberList from './MemberList';

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
          <MemberList 
            members={selectedManagers} 
            manager={true} 
            handleChangeRole={this.handleChangeRole} 
            deleteUser={this.deleteUser}
          />
          <MemberList 
            members={selectedUsers} 
            manager={false} 
            handleChangeRole={this.handleChangeRole} 
            deleteUser={this.deleteUser}
          />
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