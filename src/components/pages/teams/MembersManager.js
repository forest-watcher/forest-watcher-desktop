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

  handleChangeAdmin = (member, toAdmin) => {
    if (toAdmin){
      this.handleDeleteUser(member);
      //this.handleAddAdmin
    } else {
      this.handleAddAdmin(member)
      //this.handleDeleteUser(user);
    }
  }

  render() {
    const { form, selectedUsers } = this.props;
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
            <button type="button" onClick={this.handleAddUser} className="c-button -light">Add</button>
          </div>
          {form.managers && form.managers.map((manager, i) => (
            <div key={i} className="horizontal-field-left">
              <div className="user-label">{ manager }</div>
              <Checkbox id={`admin${i}`} label={"Admin"} callback={() => this.handleChangeAdmin(manager, false)} defaultChecked={true}/>
              <button className="delete-button hidden" type="button">
                <Icon name="icon-delete" className="-medium" />
              </button>
            </div>
          ))}
          {selectedUsers.map((user, i) => (
            <div key={i} className="horizontal-field-left"> 
              <div className="user-label">{ user }</div>
              <Checkbox id={`user${i}`} label={"Admin"} callback={() => this.handleChangeAdmin(user, true)} />
              <button class="delete-button" type="button" onClick={() => this.handleDeleteUser(user)}>
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
  form: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  updateSelectedUsers: PropTypes.func.isRequired
};

export default MembersManager;