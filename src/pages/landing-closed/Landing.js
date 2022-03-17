import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { GFW_ASSETS_PATH, DOWNLOAD_APK_LINK, DOWNLOAD_APK_VERSION } from '../../constants/landing';
import SocialFooter from '../landing/SocialFooter';
import Select from 'react-select';
import Script from 'react-load-script';
import DropdownIndicator from '../../components/ui/SelectDropdownIndicator'
import ReactGA from 'react-ga';

class Landing extends React.Component {

  static propTypes = {
    locale: PropTypes.string,
    setLocale: PropTypes.func,
    translations: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.languages = props.translations && Object.keys(props.translations).map((lang) => (
      { value: lang, label: lang.toUpperCase() }
    ));
    this.state = {
      gfwBarLoaded: false
    };
  }

  componentDidMount(){
    this.uglyHackToSetGFWBar(true);
  }

  componentWillUnmount(){
    this.uglyHackToSetGFWBar(false);
    window._babelPolyfill = false;
  }

  uglyHackToSetGFWBar(open) {
    this.header = document.getElementById('headerGfw');
    if (this.header) {
      if (open) {
        this.header.style = 'height: auto; visibility: visible;';
      } else {
        this.header.style = `height: 0px; visibility: hidden;`;
      }
    }
  }

  handleLanguageChange(e) {
    this.props.setLocale(e.value);
  }

  render() {
    return (
      <div className="c-landing">
        <div className="landing-nav">
          {this.state.gfwBarLoaded && <div className="locale-container">
            <div className="locale-select-container">
              <Select
                name="locale-select"
                className="c-select"
                classNamePrefix="Select"
                value={{value: this.props.locale, label: this.props.locale.toUpperCase()}}
                options={this.languages}
                onChange={this.handleLanguageChange}
                isSearchable={false}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>}
          <div id="loader-gfw" />
          <Script
            url={GFW_ASSETS_PATH}
            onLoad={() => {this.setState({gfwBarLoaded: true })}}
          />
        </div>
        <div className="row landing-content">
          <div className="column align-middle large-12 info-column gwf-grid-adjusted">
            <div className="main">
              <h1><FormattedMessage id="app.closedTitle" /></h1>
              <h2><FormattedMessage id="app.closed" /></h2>
            </div>
          </div>
        </div>
        <SocialFooter />
        <div id="footerGfw"></div>
      </div>
    );
  }
}

export default Landing;
