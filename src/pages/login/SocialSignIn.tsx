import FacebookLogo from "assets/images/icons/facebook-logo.svg";
import GoogleLogo from "assets/images/icons/google-logo.svg";
import { API_BASE_AUTH_URL, API_CALLBACK_URL } from "constants/global";
import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import "./login-font.module.scss";

interface IProps {}

const SocialSignIn: FC<IProps> = () => {
  return (
    <div className="c-login-form__social-buttons">
      <a
        className="c-social-button c-social-button--google"
        rel="noreferrer nofollow"
        href={`${API_BASE_AUTH_URL}/auth/google?token=true&callbackUrl=${API_CALLBACK_URL}`}
      >
        <img role="presentation" alt="" className="c-social-button__image" src={GoogleLogo} />
        <FormattedMessage id="signIn.social.google" />
      </a>
      <a
        className="c-social-button c-social-button--facebook"
        rel="noreferrer nofollow"
        href={`${API_BASE_AUTH_URL}/auth/facebook?token=true&callbackUrl=${API_CALLBACK_URL}`}
      >
        <img role="presentation" alt="" className="c-social-button__image" src={FacebookLogo} />
        <FormattedMessage id="signIn.social.facebook" />
      </a>
    </div>
  );
};

export default SocialSignIn;
