import React from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from '../../form/Form';
import Article from '../../layouts/Article';
import Hero from '../../layouts/Hero'; 

class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.form = {
      id: props.team && props.team.id,
      name: props.team && props.team.attributes.name,
      areas: props.team && props.team.attributes.areas,
      managers: props.team && props.team.attributes.managers || [this.props.userId],
      users: props.team && props.team.attributes.users || []
    }
  }
  componentWillMount() {
    this.props.getTeams();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.team ? this.props.updateTeam(this.form) : this.props.createTeam(this.form);
  }

  setEditing = (value) => {
    this.props.setEditing(value);
  }

  handleAddMember(e){
    e.preventDefault();
  }

  onInputChange = (e) => {
    this.form[e.target.name] = e.target.value;
  }

  render() {
    const { team } = this.props;
    const actionName = this.props.team ? 'Edit' : 'Create'
    return (
      (this.props.team && !this.props.editing) ? 
        <div>
          {this.props.isManager ? 
            <Hero
              title="My Team"
              action={{name: actionName, callback: () => this.setEditing(true)}}
            /> 
          : <Hero title="My Team" />
          }
            <div className="l-content">
              <Article>
                <div>
                  Team Name
                </div>
                <div>
                  {team && team.id}
                </div>
                <div>
                  Associated areas of interest
                </div>
                <div>
                  {team && team.attributes.areas && team.attributes.areas.map((area, i) =>  (<div key={i}>{ area }</div>))}
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
        <div>
          <Hero
           title={`${actionName} team`}
          />
          <Form onSubmit={this.handleSubmit}>
            <div className="c-form">
              <div className="row">
                <div className="small-6 columns">
                  <label className="text -x-small-title">Team name </label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.form.name || ''}
                    placeholder={"Team name"}
                    validations={['required']}
                  />
                  <label className="text -x-small-title">Associated Areas of Interest </label>
                  <Input
                    type="text"
                    onChange={this.onInputChange}
                    name="areas"
                    value={this.form.areas || ''}
                    placeholder={"Areas of Interest"}
                    validations={['required']}
                  />
                </div>
                <div className="small-6 columns">
                  <label className="text -x-small-title">Members</label>
                  <input
                    type="text"
                    onChange={this.handleSearch}
                    name="add-member"
                    placeholder={"Find by email"}
                  />
                  {this.form.managers && this.form.managers.map((manager, i) => (
                    <div key={i}> 
                      <div>
                        { manager }     
                        Admin <input type="checkbox" defaultChecked onChange={this.handleChangeAdmin}/>
                      </div>
                    </div>
                  ))}
                  {this.form.users && this.form.users.map((users, i) => (
                    <div key={i}> 
                      <div>
                        { users }     
                        Admin <input type="checkbox" onChange={this.handleChangeAdmin}/>
                      </div>
                    </div>
                  ))}
                  <button onClick={this.handleAddMember} className="c-button -light">Add</button>
                </div>
                <div className="row small-12 columns">
                  <div className="c-form -nav">
                    <button onClick={() => this.setEditing(false)} className="c-button -light">Cancel</button>
                    <button type="submit" className="c-button">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
    );
  }
}

Teams.propTypes = {
  team: PropTypes.object,
  getTeams: PropTypes.func.isRequired,
  isManager: PropTypes.bool
};

export default Teams;
