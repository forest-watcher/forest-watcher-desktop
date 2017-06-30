import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../ui/Icon';

class MembersManager extends React.Component {
  constructor() {
    super();
    this.state = {
      emailToSearch: ''
    }
  }

  handleAddUser = async () => {
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

  handleDeleteUser = (deletedUser) => {
    const updatedUsers = this.props.selectedUsers.filter(user => user !== deletedUser);
    this.props.updateSelectedUsers(updatedUsers);
  }

  render() {
    const { form, selectedUsers } = this.props;
    return (
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
        {form.managers && form.managers.map((manager, i) => (
          <div key={i}> 
            <div>
              { manager }     
              <input type="checkbox" id="admin" defaultChecked onChange={this.handleChangeAdmin}/>
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
        ))}
        {selectedUsers.map((user, i) => (
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
    );
  }
}

MembersManager.propTypes = {
  form: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  updateSelectedUsers: PropTypes.func.isRequired
};

export default MembersManager;