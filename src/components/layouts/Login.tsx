import { FC, PropsWithChildren } from "react";
import Loader from "../ui/Loader";
import DefaultIcon from "assets/images/icons/LoginIcon.svg";
import { FormattedMessage } from "react-intl";

interface IProps {
  iconUrl?: string;
  title?: string;
  text?: string;
  isLoading?: boolean;
}

const LoginLayout: FC<PropsWithChildren<IProps>> = props => {
  const { isLoading = false, iconUrl = DefaultIcon, title, text, children } = props;

  return (
    <div className="l-content l-content--neutral-400">
      <div className="row column">
        <div className="l-login-forms">
          <Loader isLoading={isLoading} />

          <img src={iconUrl} className="l-login-forms__icon" role="presentation" alt="" />
          {title && (
            <h2 className="l-login-forms__title">
              <FormattedMessage id={title} />
            </h2>
          )}
          {text && (
            <p className="l-login-forms__text">
              <FormattedMessage id={text} />
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
