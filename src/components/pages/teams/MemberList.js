import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../ui/Icon';
import Checkbox from '../../ui/Checkbox';

function MemberList({ members, manager}) {
  const memberType = manager ? 'Admin' : 'User'
  const deleteClass = manager ? 'hidden' : ''
  return (
    <div>
      {members.map((member) => (
        <div key={member} className="horizontal-field-left">
          <div className="user-label">{ member }</div>
          <Checkbox id={`${memberType}${member}`} label={memberType} callback={() => this.handleChangeRole(member, false)} defaultChecked={manager}/>
          <button className="delete-button" type="button">
            <Icon name="icon-delete" className={"-medium " + deleteClass } />
          </button>
        </div>
      ))}
    </div>
  );
}

MemberList.propTypes = {
  members: PropTypes.array.isRequired,
  manager: PropTypes.bool.isRequired
};

export default MemberList;