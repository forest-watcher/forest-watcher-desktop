import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import type { MenuProps, MenuItemProps } from "@szhsin/react-menu";
import classnames from "classnames";
import KebabIcon from "assets/images/icons/kebab.svg";
import KebabIconHover from "assets/images/icons/kebab-hover.svg";
import { FormattedMessage, useIntl } from "react-intl";

export interface IProps extends Partial<Omit<Omit<MenuProps, "menuButton">, "menuClassName">> {
  className?: string;
  toggleClassName?: string;
  menuItems: (MenuItemProps & { name: string })[];
}

const ContextMenu: FC<IProps> = props => {
  const { className, toggleClassName, menuItems, transition = true, portal = true, ...rest } = props;
  const intl = useIntl();

  return menuItems.length > 0 ? (
    <Menu
      menuClassName={classnames("c-context-menu", className)}
      menuButton={
        <MenuButton
          className={classnames("c-button", "c-context-menu__toggle", toggleClassName)}
          aria-label={intl.formatMessage({ id: "common.open.menu" })}
          data-testid="menuToggle"
        >
          <img className="c-context-menu__icon" alt="" role="presentation" src={KebabIcon} />
          <img className="c-context-menu__icon c-context-menu--hover" alt="" role="presentation" src={KebabIconHover} />
        </MenuButton>
      }
      portal={portal}
      transition={transition}
      {...rest}
    >
      {menuItems.map(({ className, name, href, ...rest }) => {
        const menuItemClassName = classnames("c-context-menu__item", className);

        return (
          <MenuItem key={name} className={!href ? menuItemClassName : undefined} {...rest}>
            <FormattedMessage id={name}>
              {txt =>
                href ? (
                  <Link className={menuItemClassName} to={href}>
                    {txt}
                  </Link>
                ) : (
                  <>{txt}</>
                )
              }
            </FormattedMessage>
          </MenuItem>
        );
      })}
    </Menu>
  ) : null;
};

export default ContextMenu;
