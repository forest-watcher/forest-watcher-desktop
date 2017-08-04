import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import L from 'leaflet';


class CountrySearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      country: null
    };
  }
  
  componentDidMount() {
    if (!this.props.countries.length) {
      this.props.getCountries();
    }
  }

  handleFitCountry = (selected) => {
    this.setState({
      country: selected
    })
    const activeCountryBounds = this.props.countries.filter((country) => {
      return country.iso === selected.option;
    })[0].bbox;
    const geoJSON = JSON.parse(activeCountryBounds);
    const countryBounds = geoJSON.coordinates[0].map(pt => [pt[1], pt[0]]);
    const bounds = L.latLngBounds(countryBounds, { padding: [15, 15] });
    this.props.map.fitBounds(bounds);
    this.props.onZoomChange && this.props.onZoomChange(this.props.map.getZoom());
  }

  render() {
    const { countriesOptions } = this.props;
    return (
      <div className="c-country-search">
          <Select
            name="country-select"
            className="c-select -map"
            options={countriesOptions}
            value={this.state.country}
            onChange={this.handleFitCountry}
            placeholder={this.props.intl.formatMessage({ id: 'areas.countryPlaceholder' })}
            searchable={true}
            clearable={false}
            arrowRenderer={() => <svg className="c-icon -x-small -gray"><use xlinkHref="#icon-arrow-down"></use></svg>}
          />        
      </div>
    );
  }
}

CountrySearch.propTypes = {
  countries: PropTypes.array
};

export default injectIntl(CountrySearch);
