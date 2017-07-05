import React from 'react';
import PropTypes from 'prop-types';
import MemberList from './MemberList';
import { includes } from '../../../helpers/utils';
import { FormattedMessage, injectIntl } from 'react-intl';

class MembersManager extends React.Component {
  constructor() {
    super();
    this.state = {
      emailToSearch: ''
    }
  }

  handleAddEmail = async () => {
    const email = this.state.emailToSearch;
    const existingUsers = this.props.selectedUsers;
    if (email && !includes(existingUsers.concat(this.props.selectedManagers), email)) {
      existingUsers.push(email);
      this.props.updateSelectedUsers(existingUsers);
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
          <label htmlFor="add-member" className="text"><FormattedMessage id={"teams.members"} /></label>
          <div className="horizontal-field-left">
            <input
              type="email"
              onChange={(event) => this.setState({ emailToSearch: event.target.value})}
              value={this.state.emailToSearch}
              name="add-member"
              placeholder={ this.props.intl.formatMessage({ id: 'teams.findByEmail' }) }
            />
            <button type="button" onClick={this.handleAddEmail} className="c-button -light"><FormattedMessage id={"common.add"} /></button>
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

export default injectIntl(MembersManager);