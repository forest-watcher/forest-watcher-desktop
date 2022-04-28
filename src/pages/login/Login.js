import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import Icon from "../../components/ui/Icon";

import { API_BASE_AUTH_URL, API_CALLBACK_URL } from "../../constants/global";

function LoginButton({ socialNetwork, callbackUrl }) {
  const url = `${API_BASE_AUTH_URL}/auth/${socialNetwork}?token=true&callbackUrl=${callbackUrl || API_CALLBACK_URL}`;
  return (
    <div className={`login-button -${socialNetwork}`}>
      <a href={url}>
        <div className="network-container">
          <Icon className="-white" name={`icon-${socialNetwork}`} />
          <span>{socialNetwork}</span>
        </div>
        <Icon className="-white -small -rotate-right" name={`icon-arrow-down`} />
      </a>
    </div>
  );
}

function Login({ callbackUrl }) {
  return (
    <div className="c-login row">
      <div className="column small-12">
        <div className="login-content">
          <div className="login-heading">
            <Icon className="-huge" name="icon-forest-watcher-big" />
            <h1 className="text -logo-title">
              <FormattedMessage id="app.name" />
            </h1>
            <p className="text -logo-subtitle text-message">
              <FormattedMessage id="login.welcome" />
            </p>
          </div>
          <LoginButton socialNetwork="facebook" callbackUrl={callbackUrl} />
          <LoginButton socialNetwork="twitter" callbackUrl={callbackUrl} />
          <LoginButton socialNetwork="google" callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}

LoginButton.propTypes = {
  socialNetwork: PropTypes.string
};

export default Login;
