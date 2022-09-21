import { Component } from "react";
import PropTypes from "prop-types";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import isValidCoordinates from "is-valid-coordinates";
import { GOOGLE_PLACES_API_KEY } from "../../constants/global";
import CountrySearch from "../country-search/CountrySearchContainer";
import Icon from "./Icon";

export default class LocationSearchInput extends Component {
  static propTypes = {
    intl: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lat: "",
      lng: "",
      open: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

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
          this.props.onLatLngChanged({ lat: this.state.lat, lng: this.state.lng });
        }
        this.waitForCoordChange = false;
      }, 1000);
    }
  }

  handleSelect(address) {
    const request = {
      placeId: address.place_id,
      fields: ["geometry"]
    };

    // The service requires a html node to throw the results into and carry on.
    // https://stackoverflow.com/questions/14343965/google-places-library-without-map
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.props.onLocationChanged(place);
      }
    });
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;

    document.body.appendChild(script);
  }

  render() {
    const { intl } = this.props;
    if (!window.google) {
      return null;
    }
    return (
      <div className="c-location-search">
        {this.state.open && (
          <div className="c-location-search-menu u-padding-tiny u-margin-right-tiny">
            <GooglePlacesAutocomplete onSelect={this.handleSelect} />
            <CountrySearch map={this.props.map} onZoomChange={this.props.onZoomChange} />
            <div className="c-latlong-search u-margin-top-tiny">
              <p className="u-margin-bottom-tiny">{intl.formatMessage({ id: "areas.locationSearch" })}</p>
              <label htmlFor="lat" className="u-visually-hidden">
                {intl.formatMessage({ id: "areas.latitude" })}
              </label>
              <input
                type="number"
                name="lat"
                id="lat"
                value={this.state.lat}
                onChange={this.handleInputChange}
                placeholder={intl.formatMessage({ id: "areas.latitude" })}
                className="u-margin-bottom-tiny"
              />
              <label htmlFor="lng" className="u-visually-hidden">
                {intl.formatMessage({ id: "areas.longitude" })}
              </label>
              <input
                type="number"
                name="lng"
                id="lng"
                value={this.state.lng}
                onChange={this.handleInputChange}
                placeholder={intl.formatMessage({ id: "areas.longitude" })}
              />
            </div>
          </div>
        )}
        <button className="button -map" type="button" onClick={this.toggleMenu}>
          <Icon name={this.state.open ? "icon-close-no-background" : "icon-search"} className="-small" />
        </button>
      </div>
    );
  }
}

LocationSearchInput.propTypes = {
  onLocationChanged: PropTypes.func.isRequired,
  onLatLngChanged: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  onZoomChange: PropTypes.func.isRequired
};
