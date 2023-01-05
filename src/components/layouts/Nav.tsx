import { HTMLAttributes, useMemo, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import Select from "components/ui/Form/Select";

import { MY_GFW_LINK } from "../../constants/global";
import { FormattedMessage, useIntl } from "react-intl";
import ReactGA from "react-ga";
import classnames from "classnames";
import Logo from "assets/images/Logo.svg";
import ProfileIcon from "assets/images/icons/Profile.svg";
import { useMediaQuery } from "react-responsive";
import { Popover } from "@headlessui/react";

import { FC } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
//@ts-ignore
import breakpoints from "styles/utilities/_u-breakpoints.scss";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  translations: any;
  setLocale: (val: string) => void;
  loggedIn: boolean;
  logout: () => void;
  locale: string;
  user: any;
}

export interface IFormValues {
  localeSelect?: string;
}

interface INavLinks {
  loggedIn: boolean;
  formHook: UseFormReturn<IFormValues, any>;
  languages: {
    value: string;
    label: string;
  }[];
  user: any;
  logout: () => void;
  onLinkSelect?: () => void;
}

const NavLinks: FC<INavLinks> = ({ loggedIn, formHook, languages, user, logout, onLinkSelect }) => {
  const { register } = formHook;
  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });

  return (
    <>
      <div className={classnames("c-nav__section", !loggedIn && "c-nav__section--no-grow")}>
        {loggedIn && (
          <ul className="c-nav__subsection c-nav__subsection--links">
            <li className="c-nav__link-wrapper">
              <NavLink
                to="/areas"
                className="c-nav__link"
                activeClassName="c-nav__link--active"
                onClick={() => onLinkSelect?.()}
              >
                <FormattedMessage id="areas.name" />
              </NavLink>
            </li>
            <li className="c-nav__link-wrapper">
              <NavLink
                to="/reporting"
                className="c-nav__link"
                activeClassName="c-nav__link--active"
                onClick={() => onLinkSelect?.()}
              >
                <FormattedMessage id="reports.name" />
              </NavLink>
            </li>
            <li className="c-nav__link-wrapper">
              <NavLink
                to="/templates"
                className="c-nav__link"
                activeClassName="c-nav__link--active"
                onClick={() => onLinkSelect?.()}
              >
                <FormattedMessage id="templates.name" />
              </NavLink>
            </li>
            <li className="c-nav__link-wrapper">
              <NavLink
                to="/teams"
                className="c-nav__link"
                activeClassName="c-nav__link--active"
                onClick={() => onLinkSelect?.()}
              >
                <FormattedMessage id="teams.name" />
              </NavLink>
            </li>
            <li className="c-nav__link-wrapper">
              <NavLink
                to="/layers"
                className="c-nav__link"
                activeClassName="c-nav__link--active"
                onClick={() => onLinkSelect?.()}
              >
                <FormattedMessage id="layers.name" />
              </NavLink>
            </li>
            {isMobile && (
              <li className="c-nav__link-wrapper">
                <ReactGA.OutboundLink
                  eventLabel="navigation - myGFW"
                  to={MY_GFW_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="c-nav__link"
                  onClick={() => onLinkSelect?.()}
                >
                  <img src={ProfileIcon} alt="" role="presentation" className="c-nav__link-profile-icon" />
                  <span className="c-nav__link-text">
                    {user?.data?.firstName} {user?.data?.lastName}
                  </span>
                </ReactGA.OutboundLink>
              </li>
            )}
          </ul>
        )}
        <ul className="c-nav__subsection c-nav__subsection--settings">
          <li className="c-nav__menu">
            <Select
              id="locale-select"
              registered={register("localeSelect")}
              formHook={formHook}
              variant="simple"
              hideLabel
              selectProps={{
                placeholder: "",
                options: languages,
                label: "Select",
                defaultValue: languages[0]
              }}
            />
          </li>

          {loggedIn && (
            <>
              {!isMobile && (
                <li className="c-nav__link-wrapper max-w-[200px]">
                  <ReactGA.OutboundLink
                    eventLabel="navigation - myGFW"
                    to={MY_GFW_LINK}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="c-nav__link"
                  >
                    <img src={ProfileIcon} alt="" role="presentation" className="c-nav__link-profile-icon" />
                    <span className="c-nav__link-text">
                      {user?.data?.firstName} {user?.data?.lastName}
                    </span>
                  </ReactGA.OutboundLink>
                </li>
              )}
              <li className="c-nav__link-wrapper">
                <Link
                  to="/login"
                  onClick={() => {
                    onLinkSelect?.();
                    logout();
                  }}
                  className="c-nav__link"
                >
                  <FormattedMessage id="app.logout" />
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

const Nav: FC<IProps> = props => {
  const { translations, setLocale, loggedIn, logout, locale, user, ...rest } = props;
  const formhook = useForm<IFormValues>({ defaultValues: { localeSelect: locale } });
  const { watch } = formhook;
  const intl = useIntl();
  const localeValue = watch("localeSelect");
  const isMobile = useMediaQuery({ maxWidth: breakpoints.mobile });

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
        {!isMobile ? (
          <NavLinks loggedIn={loggedIn} formHook={formhook} languages={languages} user={user} logout={logout} />
        ) : (
          <Popover className="c-nav__dropdown">
            {({ open, close }) => (
              <>
                <Popover.Button className="c-nav__dropdown-button">
                  <FormattedMessage id={!open ? "common.menu" : "common.close"} />
                  <div className={classnames("c-nav__dropdown-hamburger", open && "c-nav__dropdown-hamburger--open")}>
                    <span className="c-nav__dropdown-hamburger-stripe c-nav__dropdown-hamburger-stripe--1" />
                    <span className="c-nav__dropdown-hamburger-stripe c-nav__dropdown-hamburger-stripe--2" />
                    <span className="c-nav__dropdown-hamburger-stripe c-nav__dropdown-hamburger-stripe--3" />
                  </div>
                </Popover.Button>

                <Popover.Panel className="c-nav__dropdown-panel">
                  <NavLinks
                    loggedIn={loggedIn}
                    formHook={formhook}
                    languages={languages}
                    user={user}
                    logout={logout}
                    onLinkSelect={() => {
                      close();
                    }}
                  />
                </Popover.Panel>
              </>
            )}
          </Popover>
        )}
      </nav>
    </div>
  );
};

export default Nav;
