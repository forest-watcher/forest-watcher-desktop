import { connect } from "react-redux";
import CountrySearch from "./CountrySearch";
import { getCountries } from "../../modules/areas";

const mapCountriesToOptions = countries => {
  const countriesOptions = [];
  countries.forEach(country => {
    if (JSON.parse(country.bbox)) {
      countriesOptions.push({
        option: country.iso,
        label: country.name_engli,
        value: country.iso
      });
    }
  });
  return countriesOptions;
};

const mapStateToProps = state => {
  const countriesOptions = mapCountriesToOptions(state.areas.countries);
  return {
    countries: state.areas.countries,
    countriesOptions: countriesOptions
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getCountries: () => {
      dispatch(getCountries());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CountrySearch);
