import React from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import Select from "react-select";
import L from "leaflet";
import DropdownIndicator from "../../components/ui/SelectDropdownIndicator";

const mapCountries = countries => {
  return countries.map(country => {
    return { label: country.label, value: country.option };
  });
};

class CountrySearch extends React.Component {
  constructor(props) {
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

  handleFitCountry = selected => {
    this.setState({ country: selected });
    const activeCountryBounds = this.props.countries.find(country => {
      return country.iso === selected.value;
    }).bbox;
    const geoJSON = JSON.parse(activeCountryBounds);
    const countryBounds = geoJSON.coordinates[0].map(pt => [pt[1], pt[0]]);
    const bounds = L.latLngBounds(countryBounds, { padding: [15, 15] });
    this.props.map.fitBounds(bounds);
    this.props.onZoomChange && this.props.onZoomChange(this.props.map.getZoom());
  };

  render() {
    const { countriesOptions } = this.props;
    return (
      <div className="c-country-search u-margin-bottom-tiny">
        <Select
          name="country-select"
          className="c-select -map u-w-100"
          classNamePrefix="Select"
          options={mapCountries(countriesOptions)}
          valueKey="option"
          getValue={() => {
            return this.state.country
              ? { label: this.state.country.label, option: this.state.country.option || "" }
              : null;
          }}
          onChange={this.handleFitCountry}
          placeholder={this.props.intl.formatMessage({ id: "areas.countryPlaceholder" })}
          isSearchable={true}
          isClearable={false}
          components={{ DropdownIndicator }}
        />
      </div>
    );
  }
}

CountrySearch.propTypes = {
  countries: PropTypes.array
};

export default injectIntl(CountrySearch);
