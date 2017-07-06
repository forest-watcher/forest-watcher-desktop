import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../ui/Icon';
import Checkbox from '../../ui/Checkbox';
import { injectIntl } from 'react-intl';
import { MANAGER, USER } from '../../../constants/global';


function MemberList({ members, handleChangeRole, deleteMember, intl }) {
  return (
    <div>
      { members.map((member, index) => {
        const isAdmin = member.memberType === MANAGER;
        const deleteClass = member.memberType === MANAGER ? 'hidden' : '';
        const memberId = member.id;
        return (
          <div key={memberId} className="horizontal-field-left">
            <div className="user-label">{ memberId }</div>
            {(member.memberType) !== USER && 
              <Checkbox 
                  id={memberId} 
                  label={ intl.formatMessage({ id: "teams.admin" }) } 
                  callback={() => handleChangeRole(memberId, !isAdmin)} 
                  defaultChecked={isAdmin}/>
            }
            <button className="delete-button" type="button" onClick={() => deleteMember(memberId, member.memberType)}>
              <Icon name="icon-delete" className={"-small " + deleteClass } />
            </button>
          </div>
        )
      })}
    </div>
  );
}

MemberList.propTypes = {
  members: PropTypes.array.isRequired,
  handleChangeRole: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired
};

export default injectIntl(MemberList);