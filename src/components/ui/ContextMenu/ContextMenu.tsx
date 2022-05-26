import React, { FC, ReactNode } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import type { MenuProps, MenuItemProps } from "@szhsin/react-menu";
import classnames from "classnames";
import KebabIcon from "assets/images/icons/kebab.svg";
import KebabIconHover from "assets/images/icons/kebab-hover.svg";
import Button from "../Button/Button";

export interface IProps extends Partial<Omit<Omit<MenuProps, "menuButton">, "menuClassName">> {
  className?: string;
  menuButton?: ReactNode;
  menuItems: {
    className?: string;
    name: string;
    value?: string;
    onClick: MenuItemProps["onClick"];
  }[];
}

interface IContextMenuToggleProps extends React.HTMLAttributes<HTMLButtonElement> {}

interface ICardComposition {
  Toggle: FC<IContextMenuToggleProps>;
}

const ContextMenuToggle: FC<IContextMenuToggleProps> = props => {
  const { className, ...rest } = props;

  return (
    <Button
      className={classnames("c-context-menu__toggle", className)}
      variant="blank"
      aria-label="Open Menu"
      {...rest}
    >
      <img className="c-context-menu__icon" alt="" role="presentation" src={KebabIcon} />
      <img className="c-context-menu__icon c-context-menu--hover" alt="" role="presentation" src={KebabIconHover} />
    </Button>
  );
};
const ContextMenu: FC<IProps> & ICardComposition = props => {
  const { className, menuButton = <ContextMenuToggle />, menuItems, transition = true, portal = true, ...rest } = props;

  return (
    <Menu
      menuClassName={classnames("c-context-menu", className)}
      menuButton={<MenuButton>{menuButton}</MenuButton>}
      portal={portal}
      transition={transition}
      {...rest}
    >
      {menuItems.map(({ className, name, ...rest }) => (
        <MenuItem className={classnames("c-context-menu__item", className)} {...rest}>
          {name}
        </MenuItem>
      ))}
    </Menu>
  );
};

ContextMenu.Toggle = ContextMenuToggle;

export default ContextMenu;
