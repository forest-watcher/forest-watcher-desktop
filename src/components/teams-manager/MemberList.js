import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { injectIntl } from 'react-intl';
import { MANAGER } from '../../constants/global';


function MemberList({ members, handleChangeRole, deleteMember, intl }) {
  return (
    <div className="c-member-list">
      { members.map((member, k) => {
        const { email, id, memberType } = member;
        const hiddenButton = memberType === MANAGER ? 'hidden' : '';
        return (
          <div key={`${memberType}${id}${k}`} className="horizontal-field-left-aligned">
            <div className="user-label">{ email || id }</div>
            <div className={hiddenButton}>
              <button className={"delete-button"} type="button" onClick={() => deleteMember(id, memberType)}>
                <Icon name="icon-delete" className="-small " />
              </button>
            </div>
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
