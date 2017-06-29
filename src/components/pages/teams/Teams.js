import React from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from '../../form/Form';
import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import Select from 'react-select';


class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: ''
    }
    this.updateForm(props.team);
  }

  updateForm(team){
    this.form = {
      name: team && team.attributes.name,
      areas: (team && team.attributes.areas) || [],
      managers: (team && team.attributes.managers) || [this.props.userId],
      users: (team && team.attributes.users) || []
    }
  }

  componentWillMount() {
    this.props.getTeams();
  }
  componentWillReceiveProps(nextProps){
    if (this.props.team !== nextProps.team){
      this.updateForm(nextProps.team);
      if ( nextProps.team ){
        this.setState({ areas: nextProps.team.attributes.areas.join() })
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.team ? this.props.updateTeam(this.form, this.props.team.id) : this.props.createTeam(this.form);
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

  onAreaChange = (selected) => {
    this.setState({areas: selected});
    this.form.areas = selected.split(',');
  }

  render() {
    const { team, areaValues, editing, isManager } = this.props;
    const actionName = this.props.team ? 'Edit' : 'Create'
    return (
      (team && !editing) ? 
        <div>
          {isManager ? 
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
                  <Select
                    multi
                    simpleValue
                    name="areas-select"
                    options={areaValues}
                    value={this.state.areas}
                    onChange={this.onAreaChange}
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
