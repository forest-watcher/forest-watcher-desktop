import { HTMLAttributes, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Select from "components/ui/Form/Select";

import { MY_GFW_LINK } from "../../constants/global";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import classnames from "classnames";
import Logo from "assets/images/Logo.svg";
import ProfileIcon from "assets/images/icons/Profile.svg";

import { FC } from "react";
import { useForm } from "react-hook-form";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  translations: any;
  setLocale: (val: string) => void;
  loggedIn: boolean;
  logout: () => void;
  locale: string;
  user: any;
}

const Nav: FC<IProps> = props => {
  const { translations, setLocale, loggedIn, logout, locale, user, ...rest } = props;
  const formhook = useForm();
  const { register, watch } = formhook;
  const intl = useIntl();
  const localeValue = watch("localeSelect");

  useEffect(() => {
    if (localeValue) {
      setLocale(localeValue);
    }
  }, [localeValue, setLocale]);

  const languages = useMemo(
    () =>
      Object.keys(translations).map(lang => ({
        value: lang,
        label: intl.formatMessage({ id: `app.localeName.${lang}`, defaultMessage: lang })
      })),
    [intl, translations]
  );

  const username = (user.data && user.data.name) || <FormattedMessage id="app.setupEmail" />;

  return (
    <div className="row column" {...rest}>
      <nav className="c-nav">
        <h1>
          <NavLink exact to="/" className="c-nav__logo" activeClassName="c-nav__logo--active">
            <img src={Logo} alt="" role="presentation" />
            <span className="u-visually-hidden">
              <FormattedMessage id="app.name" />
            </span>
          </NavLink>
        </h1>
        <div className="c-nav__section">
          {loggedIn && (
            <ul className="c-nav__subsection c-nav__subsection--links">
              <li className="c-nav__link-wrapper">
                <NavLink to="/reports" className="c-nav__link" activeClassName="c-nav__link--active">
                  <FormattedMessage id="reports.name" />
                </NavLink>
              </li>
              <li className="c-nav__link-wrapper">
                <NavLink to="/areas" className="c-nav__link" activeClassName="c-nav__link--active">
                  <FormattedMessage id="areas.name" />
                </NavLink>
              </li>
              <li className="c-nav__link-wrapper">
                <NavLink to="/templates" className="c-nav__link" activeClassName="c-nav__link--active">
                  <FormattedMessage id="templates.name" />
                </NavLink>
              </li>
              <li className="c-nav__link-wrapper">
                <NavLink to="/settings" className="c-nav__link" activeClassName="c-nav__link--active">
                  <FormattedMessage id="teams.name" />
                </NavLink>
              </li>
              <li className="c-nav__link-wrapper">
                <NavLink to="/layers" className="c-nav__link" activeClassName="c-nav__link--active">
                  <FormattedMessage id="layers.name" />
                </NavLink>
              </li>
            </ul>
          )}
          <ul className={classnames("c-nav__subsection", loggedIn && "c-nav__subsection--settings")}>
            <li className="c-nav__menu">
              {/* <LegacySelect
                name="locale-select"
                className="c-select -dark"
                classNamePrefix="Select"
                value={{ value: locale, label: locale.toUpperCase() }}
                options={languages}
                onChange={handleLanguageChange}
                isSearchable={false}
                components={{ DropdownIndicator }}
              /> */}
              <Select
                id="locale-select"
                registered={register("localeSelect")}
                formHook={formhook}
                isSimple
                selectProps={{
                  placeholder: "",
                  options: languages,
                  label: "Select",
                  defaultValue: languages[0]
                }}
              />
            </li>
            <li className="c-nav__link-wrapper">
              <ReactGA.OutboundLink
                eventLabel="navigation - myGFW"
                to={MY_GFW_LINK}
                rel="noopener noreferrer"
                target="_blank"
                className="c-nav__link"
              >
                <img src={ProfileIcon} alt="" role="presentation" className="c-nav__link-profile-icon" />
                <span className="c-nav__link-text">{username}</span>
              </ReactGA.OutboundLink>
            </li>

            {loggedIn && (
              <li className="c-nav__link-wrapper">
                <button onClick={logout} className="c-nav__link">
                  <FormattedMessage id="app.logout" />
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
