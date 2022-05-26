import { FC, ReactNode } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import type { MenuProps, MenuItemProps } from "@szhsin/react-menu";
import classnames from "classnames";

export interface IProps extends Partial<Omit<Omit<MenuProps, "menuButton">, "menuClassName">> {
  className?: string;
  menuButton: ReactNode;
  menuItems: {
    className?: string;
    name: string;
    value?: string;
    onClick: MenuItemProps["onClick"];
  }[];
}

const ContextMenu: FC<IProps> = props => {
  const { className, menuButton, menuItems, transition = true, portal = true, ...rest } = props;

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

export default ContextMenu;
