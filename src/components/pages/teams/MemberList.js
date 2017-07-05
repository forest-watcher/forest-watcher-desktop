import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../ui/Icon';
import Checkbox from '../../ui/Checkbox';

function MemberList({ members, manager, handleChangeRole, deleteUser }) {
  const memberType = manager ? 'Admin' : 'User'
  const deleteClass = manager ? 'hidden' : ''
  return (
    <div>
      {members.map((member) => (
        <div key={`${memberType}${member}`} className="horizontal-field-left">
          <div className="user-label">{ member }</div>
          <Checkbox 
              id={`${memberType}${member}`} 
              label={memberType} 
              callback={() => handleChangeRole(member, !manager)} 
              defaultChecked={manager}/>
          <button className="delete-button" type="button" onClick={() => deleteUser(member)}>
            <Icon name="icon-delete" className={"-medium " + deleteClass } />
          </button>
        </div>
      ))}
    </div>
  );
}

MemberList.propTypes = {
  members: PropTypes.array.isRequired,
  manager: PropTypes.bool.isRequired,
  handleChangeRole: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default MemberList;