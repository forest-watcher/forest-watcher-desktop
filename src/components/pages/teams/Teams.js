import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import TeamsForm from './TeamsFormContainer';

class Teams extends React.Component {
  componentWillMount() {
    this.props.getTeams();
  }

  render() {
    const { team, editing, isManager } = this.props;
    const actionName = this.props.team ? 'Edit' : 'Create'
    return (
      (team && !editing) ? 
        <div>
          {isManager ? 
            <Hero
              title="My Team"
              action={{name: actionName, callback: () => this.setEditing(true)}}
            /> 
          : 
            <Hero title="My Team" />
          }
          <div className="l-content">
            <Article>
              <div>
                Team Name
              </div>
              <div>
                {team && team.attributes.name}
              </div>
              <div>
                Associated areas of interest
              </div>
              <div>
                {team && team.attributes.areas && team.attributes.areas.map((area, i) => (<div key={i}>{ area }</div>))}
              </div>
              <div>
                Members
              </div>
              <div>
                {team && team.attributes.managers && team.attributes.managers.map((managers, i) =>  (<div key={i}>{ managers }</div>))}
                {team && team.attributes.users && team.attributes.users.map((users, i) =>  (<div key={i}>{ users }</div>))}
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
  getTeams: PropTypes.func.isRequired,
  isManager: PropTypes.bool
};

export default Teams;
