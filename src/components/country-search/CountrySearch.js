import React from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import Select from "react-select";
import DropdownIndicator from "../../components/ui/SelectDropdownIndicator";
import { getBoundFromGeoJSON } from "helpers/map";

const mapCountries = countries => countries.map(country => ({ label: country.label, value: country.option }));

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
    const activeCountryBounds = this.props.countries.find(country => country.iso === selected.value).bbox;
    const bounds = getBoundFromGeoJSON(JSON.parse(activeCountryBounds));
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
          getValue={() =>
            this.state.country ? { label: this.state.country.label, option: this.state.country.option || "" } : null
          }
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
