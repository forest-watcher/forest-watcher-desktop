import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

function TeamsShow({ team, areas }) {
  return (
    <div className="row">
      <div className="small-12 medium-6 columns">
        <div className="section">
          <div className="title"><FormattedMessage id={"teams.teamName"} /></div>
          <div>
            {team && team.attributes.name}
          </div>
        </div>
        <div className="section">
          <div className="title"><FormattedMessage id={"teams.areas"} /></div>
          <div className="area-image-container">
            {team && areas.map((area, i) => ( area && (
              <div className="area-item" key={i}>
                <figure className="area-image" style={{ backgroundImage: `url(${area.attributes.image})`}}></figure>
                <figcaption className="text -small-title">{area.attributes.name}</figcaption>
              </div>
            )))}
          </div>
        </div>
      </div>
      <div className="small-12 medium-6 columns">
        <div className="section">
          <div className="title"><FormattedMessage id={"teams.members"} /></div>
        </div>
        <div className="c-member-list">
          {team && team.attributes.managers && team.attributes.managers.map((manager) =>  (
            <div className="horizontal-field-left-aligned" key={manager}>
              { manager }
              <span className="admin-selected"><FormattedMessage id={"teams.admin"} /></span>
            </div>
            ))}
          {team && team.attributes.confirmedUsers && team.attributes.confirmedUsers.map((confirmedUser) =>  (
            <div className="horizontal-field-left-aligned" key={confirmedUser}>
              { confirmedUser }
            </div>
            ))}
          {team && team.attributes.users && team.attributes.users.map((user) =>  (
            <div className="horizontal-field-left-aligned" key={user}>
              { user }
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

TeamsShow.propTypes = {
  team: PropTypes.object,
  areas: PropTypes.array
};

export default TeamsShow;
