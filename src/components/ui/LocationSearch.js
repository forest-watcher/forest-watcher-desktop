import React from 'react';
import PropTypes from 'prop-types';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import isValidCoordinates from 'is-valid-coordinates'
import { GOOGLE_PLACES_API_KEY } from '../../constants/global'
import Icon from './Icon';

export default class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      lng: '',
      open: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  };

  toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    if (!this.waitForCoordChange) {
      this.waitForCoordChange = true;
      setTimeout(() => {
        if (isValidCoordinates(parseInt(this.state.lng, 10), parseInt(this.state.lat, 10))) {
          this.props.onLatLngChanged({lat: this.state.lat, lng: this.state.lng});
        }
        this.waitForCoordChange = false;
      }, 1000);
    }
  };

  handleSelect(address) {
    const request = {
      placeId: address.place_id,
      fields: ['geometry']
    };

    // The service requires a html node to throw the results into and carry on.
    // https://stackoverflow.com/questions/14343965/google-places-library-without-map
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.props.onLocationChanged(place);
      }
    });
  };

  componentDidMount () {
      const script = document.createElement("script");

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;

      document.body.appendChild(script);
  };

  render() {
    if (!window.google) {
      return null
    }
    return (
      <div className="c-location-search">
        <button className="button -map" type="button" onClick={this.toggleMenu}>
          <Icon name="icon-location" className="-small" />
        </button>
        {this.state.open &&
        <div className="c-location-search-menu">
          <GooglePlacesAutocomplete
            onSelect={this.handleSelect}
          />
          <div className="c-latlong-search u-margin-top-small">
            <p className="u-color-light">Search by Latitude and Longitude</p>
            <input
              type="number"
              name="lat"
              value={this.state.lat}
              onChange={this.handleInputChange}
              placeholder="Latitude"
              className="u-margin-bottom-tiny"/>
            <input
              type="number"
              name="lng"
              value={this.state.lng}
              onChange={this.handleInputChange}
              placeholder="Longitude"/>
          </div>
        </div>}
      </div>
    );
  };
};

LocationSearchInput.propTypes = {
  onLocationChanged: PropTypes.func.isRequired,
  onLatLngChanged: PropTypes.func.isRequired
};
