import React from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import capitalize from 'lodash/capitalize';
import MemberList from './MemberList';
import { includes, validateEmail } from '../../helpers/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { MANAGER, USER, CONFIRMED_USER, MY_GFW_LINK } from '../../constants/global';

import { CATEGORY, ACTION } from '../../constants/analytics';
import ReactGA from 'react-ga';

class MembersManager extends React.Component {
  constructor(props) {
    super(props);
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
        ReactGA.event({
          category: CATEGORY.TEAM,
          action: ACTION.ADD_TEAM,
          label: 'Add team member failed - Invalid email'
        });
        return;
      }
      const managerEmails = this.props.selectedManagers.map(m => m.email || m);
      const confirmedUserEmails = this.props.selectedConfirmedUsers.map(m => m.email || m);
      const isNotOnTheList = !includes(existingUsers.concat(confirmedUserEmails).concat(managerEmails), email);
      if (isNotOnTheList) {
        existingUsers.push(email);
        this.setState({ emailToSearch: '' });
        this.props.updateSelectedMembers(existingUsers, USER);
        ReactGA.event({
          category: CATEGORY.TEAM,
          action: ACTION.ADD_TEAM,
          label: 'Add team member success'
        });
      }

    }
  }

  formatRole(role) {
    const formatted = startCase(role)
      .split(' ')
      .map(w => capitalize(w))
      .join('');
    return `selected${formatted}s`
  }

  deleteMember = (deletedMember, role) => {
    const selected = this.props[this.formatRole(role)];
    const updatedMembers = selected.filter((member) => {
      if (role === USER) {
        return member !== deletedMember;
      } else {
        return member.id !== deletedMember;
      }
    });
    this.props.updateSelectedMembers(updatedMembers, role);
    ReactGA.event({
      category: CATEGORY.TEAM,
      action: ACTION.REMOVE_TEAM,
      label: 'Delete team member success'
    });
  }

  addMember = (member, role) => {
    const updatedMembers = this.props[this.formatRole(role)];
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
    let members = selectedManagers.map((manager) => ({ memberType: MANAGER, id: manager.id || manager, email: manager.email }));
    members = members.concat(selectedConfirmedUsers.map((confirmedUser) => ({ memberType: CONFIRMED_USER, id: confirmedUser.id || confirmedUser, email: confirmedUser.email })));
    return members.concat(selectedUsers.map((userId) => ({ memberType: USER, id: userId }))).sort(this.compareById);
  }

  render() {
    return (
      <div className="c-members-manager small-12 medium-offset-2 medium-5 columns">
        <div className="input-group">
          <h3><label htmlFor="add-member" className="text"><FormattedMessage id={"teams.members"} /></label></h3>
            <div className="horizontal-field-left-aligned">
            <input
              type="email"
              id="add-member"
              onKeyPress={(e) => {if (e.which === 13) { e.preventDefault();}}} // Prevent send on press Enter
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
            deleteMember={(...rest) => this.deleteMember(...rest)}
          />
          <span className="members-tip">
            *members must have a
            <a
              className="text -green"
              href={MY_GFW_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
            MyGFW
          </a>
            account to join a team
          </span>
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
