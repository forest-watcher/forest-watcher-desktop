import React from "react";
import PropTypes from "prop-types";

import { FormattedMessage } from "react-intl";

function TeamsShow({ team, areas }) {
  return (
    <div className="row">
      <div className="small-12 medium-5 columns">
        <div className="section">
          <h3>
            <FormattedMessage id={"teams.teamName"} />
          </h3>
          <div>{team && team.attributes.name}</div>
        </div>
        <div className="section">
          <h3>
            <FormattedMessage id={"teams.areas"} />
          </h3>
          <div className="area-image-container">
            {team &&
              areas.map(
                (area, i) =>
                  area && (
                    <div className="area-item" key={i}>
                      <figure
                        className="area-image"
                        style={{ backgroundImage: `url(${area.attributes.image})` }}
                      ></figure>
                      <figcaption className="text">{area.attributes.name}</figcaption>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
      <div className="small-12 medium-offset-2 medium-5 columns">
        <div className="section">
          <h3>
            <FormattedMessage id={"teams.members"} />
          </h3>
        </div>
        <div className="c-member-list">
          {team &&
            team.attributes.managers &&
            team.attributes.managers.map((manager, key) => (
              <div className="horizontal-field-left-aligned" key={manager.id + key}>
                <div>{manager.email || manager.id}</div>
                <div className="admin-selected">
                  <FormattedMessage id={"teams.admin"} />
                </div>
              </div>
            ))}
          {team &&
            team.attributes.confirmedUsers &&
            team.attributes.confirmedUsers.map((confirmedUser, key) => (
              <div className="horizontal-field-left-aligned" key={confirmedUser.id + key}>
                {confirmedUser.email || confirmedUser.id}
              </div>
            ))}
          {team &&
            team.attributes.users &&
            team.attributes.users.map((user, key) => (
              <div className="horizontal-field-left-aligned" key={user + key}>
                {user}
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
