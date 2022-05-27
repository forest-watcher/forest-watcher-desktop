import React, { FC } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import type { MenuProps, MenuItemProps } from "@szhsin/react-menu";
import classnames from "classnames";
import KebabIcon from "assets/images/icons/kebab.svg";
import KebabIconHover from "assets/images/icons/kebab-hover.svg";
import { FormattedMessage } from "react-intl";

export interface IProps extends Partial<Omit<Omit<MenuProps, "menuButton">, "menuClassName">> {
  className?: string;
  toggleClassName?: string;
  menuItems: {
    className?: string;
    name: string;
    value?: string;
    onClick: MenuItemProps["onClick"];
  }[];
}

const ContextMenu: FC<IProps> = props => {
  const { className, toggleClassName, menuItems, transition = true, portal = true, ...rest } = props;

  return (
    <Menu
      menuClassName={classnames("c-context-menu", className)}
      menuButton={
        <MenuButton
          className={classnames("c-button", "c-context-menu__toggle", toggleClassName)}
          aria-label="Open Menu"
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
      {menuItems.map(({ className, name, ...rest }) => (
        <MenuItem key={name} className={classnames("c-context-menu__item", className)} {...rest}>
          <FormattedMessage id={name} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ContextMenu;
