import React from 'react';
import PropTypes from 'prop-types';
import MemberList from './MemberList';
import { includes, validateEmail } from '../../../helpers/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { MANAGER, USER, CONFIRMED_USER } from '../../../constants/global';

class MembersManager extends React.Component {
  constructor() {
    super();
    this.state = {
      emailToSearch: ''
    }
  }

  handleAddEmail = () => {
    const email = this.state.emailToSearch;
    const existingUsers = this.props.selectedUsers;
    if (email){
      if (!validateEmail(email)) {
        toastr.error(this.props.intl.formatMessage({ id: 'teams.invalidEmail' }));
        return;
      }
      const isNotOnTheList = !includes(existingUsers.concat(this.props.selectedManagers), email);
      if (isNotOnTheList) {
        existingUsers.push(email);
        this.setState({ emailToSearch: '' });
        this.props.updateSelectedMembers(existingUsers, USER);
      }

    }
  }

  getPropName(role){
    let propName = null;
    switch (role) {
      case MANAGER:
        propName = 'selectedManagers';
        break;
      case USER:
        propName = 'selectedUsers';
        break;
      case CONFIRMED_USER:
        propName = 'selectedConfirmedUsers';
        break;
      default:
        break;
    }
    return propName;
  }

  deleteMember = (deletedMember, role) => {
    const updatedMembers = this.props[this.getPropName(role)].filter(member => member !== deletedMember);
    this.props.updateSelectedMembers(updatedMembers, role);
  }

  addMember = (member, role) => {
    const updatedMembers = this.props[this.getPropName(role)];
    updatedMembers.push(member);
    this.props.updateSelectedMembers(updatedMembers, role);
  }

  handleChangeRole = (member, toAdmin) => {
    if (toAdmin){
      this.addMember(member, MANAGER);
      this.deleteMember(member, CONFIRMED_USER);
    } else {
      this.addMember(member, CONFIRMED_USER);
      this.deleteMember(member, MANAGER);
    }
  }

  compareById = (a,b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }

  getMembers = () => {
    const { selectedUsers, selectedManagers, selectedConfirmedUsers } = this.props;
    let members = selectedManagers.map((managerId) => ({ memberType: MANAGER, id: managerId }));
    members = members.concat(selectedConfirmedUsers.map((confirmedUserId) => ({ memberType: CONFIRMED_USER, id: confirmedUserId })));
    return members.concat(selectedUsers.map((userId) => ({ memberType: USER, id: userId }))).sort(this.compareById);
  }

  render() {
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
            members={this.getMembers()} 
            handleChangeRole={this.handleChangeRole} 
            deleteMember={this.deleteMember}
          />
        </div>
      </div>
    );
  }
}

MembersManager.propTypes = {
  selectedManagers: PropTypes.array.isRequired,
  selectedConfirmedUsers: PropTypes.array.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  updateSelectedMembers: PropTypes.func.isRequired
};

export default injectIntl(MembersManager);