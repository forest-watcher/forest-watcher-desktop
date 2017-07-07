import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import TeamsForm from './TeamsFormContainer';
import { FormattedMessage } from 'react-intl';
import Loader from '../../ui/Loader';

class Teams extends React.Component {
  constructor() {
    super();
    this.firstLoad = true;
  }
  componentWillMount() {
    if (this.firstLoad){
      this.props.getTeam(this.props.userId);
      this.firstLoad = false;
    }
  }

  render() {
    const { team, editing, isManager, areasOfInterest } = this.props;
    return (
      <div>
        <Loader isLoading={this.props.loading} />
        {(team && !editing) ?
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
                      <div className="area-image-container">
                        {team && areasOfInterest.map((area, i) => ( area && (
                          <div key={i}>
                            <img className="area-image" src={area.attributes.image} alt={area.attributes.name} />
                            <div>{ area.attributes.name }</div>
                          </div>
                        )))}
                      </div>
                    </div>
                  </div>
                  <div className="small-6 columns">

                    <div className="section">
                      <div className="title"><FormattedMessage id={"teams.members"} /></div>
                    </div>
                    <div className="c-member-list">
                      {team && team.attributes.managers && team.attributes.managers.map((manager) =>  (
                        <div className="horizontal-field-left" key={manager}>
                          { manager }
                          <span className="admin-selected"><FormattedMessage id={"teams.admin"} /></span>
                        </div>
                        ))}
                      {team && team.attributes.confirmedUsers && team.attributes.confirmedUsers.map((confirmedUser) =>  (
                        <div className="horizontal-field-left" key={confirmedUser}>
                          { confirmedUser }
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
          </div> 
          : <TeamsForm team={team}/>
        }
      </div>
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
