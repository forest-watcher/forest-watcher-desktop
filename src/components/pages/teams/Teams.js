import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import TeamsForm from './TeamsFormContainer';
import { FormattedMessage } from 'react-intl';

class Teams extends React.Component {
  componentWillMount() {
    this.props.getTeam(this.props.userId);
  }

  render() {
    const { team, editing, isManager } = this.props;
    return (
      (team && !editing) ? 
        <div>
          {isManager ? 
            <Hero
              title={"teams.subtitle"}
              action={{name: "common.edit", callback: () => this.props.setEditing(true)}}
            /> 
          : 
            <Hero title={"teams.subtitle"} />
          }
          <div className="l-content">
            <Article>
              <div className="row">
                <div className="small-6 columns">
                  <div className="section">
                    <div className="title"><FormattedMessage id={"teams.teamName"} /></div>
                    <div>
                      {team && team.attributes.name}
                    </div>
                  </div>
                  <div className="section">
                    <div className="title"><FormattedMessage id={"teams.areas"} /></div>
                    {team && team.attributes.areas && team.attributes.areas.map((area, i) => (<div key={i}>{ area }</div>))}
                  </div>
                </div>
                <div className="small-6 columns">

                  <div className="section">
                    <div className="title"><FormattedMessage id={"teams.members"} /></div>
                  </div>
                  <div>
                    {team && team.attributes.managers && team.attributes.managers.map((manager) =>  (
                      <div className="horizontal-field-left" key={manager}>
                        { manager }
                        <span className="admin-selected">ADMIN</span>
                      </div>
                      ))}
                    {team && team.attributes.users && team.attributes.users.map((user) =>  (
                      <div className="horizontal-field-left" key={user}>
                        { user }
                      </div>
                      ))}
                  </div>
                </div>
              </div>
            </Article>
          </div>
        </div> : 
        <TeamsForm team={team}/>
    );
  }
}

Teams.propTypes = {
  team: PropTypes.object,
  getTeam: PropTypes.func.isRequired,
  isManager: PropTypes.bool,
  userId: PropTypes.string.isRequired
};

export default Teams;
