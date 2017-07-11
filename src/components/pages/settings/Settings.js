import React from 'react';
import PropTypes from 'prop-types';

import Hero from '../../layouts/Hero';
import Article from '../../layouts/Article';
import TeamsForm from './TeamsFormContainer';
import LayersManager from './LayersManagerContainer';
import { FormattedMessage } from 'react-intl';
import Loader from '../../ui/Loader';
import { includes } from '../../../helpers/utils';

class Settings extends React.Component {
  constructor() {
    super();
    this.firstLoad = true;
    this.state = {
      map: {},
      mapConfig: {
        zoom: 3,
        lat: 0,
        lng: 0,
        zoomControl: false,
        scrollWheelZoom: false,
        layers: []
      }
    }
  }

  componentWillMount() {
    if (this.firstLoad){
      this.props.getTeam(this.props.userId);
      this.firstLoad = false;
    }
  }
  addLayer = () => {
    const exampleUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    let layers = [].concat(this.state.mapConfig.layers);
    if(!includes(layers, exampleUrl)){
      layers = layers.concat(exampleUrl);
    }
    this.setState({
      mapConfig: {
        ...this.state.mapConfig,
        layers
      }
    });
  }

  render() {
    const { team, editing, loading, saving, isManager, areas } = this.props;
    return (
      <div>
        {isManager && !editing? 
          <Hero
            title={"settings.name"}
            action={{name: "common.edit", callback: () => this.props.setEditing(true)}}
          />
        : 
          <Hero title={"settings.name"} />
        }
        {loading ? 
          null
          :
          <div>
          {(team && !editing) ?
            <div>
              <div className="l-content">
                <Loader isLoading={saving} />
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
                          {team && areas.map((area, i) => ( area && (
                            <div className="area-item" key={i}>
                              <figure className="area-image" style={{ backgroundImage: `url(${area.attributes.image})`}}></figure>
                              <figcaption className="text -small-title">{area.attributes.name}</figcaption>
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
                  <LayersManager />
                </Article>
              </div>
            </div> 
            : <TeamsForm team={team}/>
          }
        </div>
      }
      </div>
    );
  }
}

Settings.propTypes = {
  team: PropTypes.object,
  getTeam: PropTypes.func.isRequired,
  isManager: PropTypes.bool,
  userId: PropTypes.string.isRequired
};

export default Settings;
