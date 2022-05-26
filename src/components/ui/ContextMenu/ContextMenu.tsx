import { FC, useEffect, useRef } from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";

interface IProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  menuItems: { name: string; onClick: () => void }[];
  position: { x: number; y: number };
}

const ContextMenu: FC<IProps> = props => {
  const { className, open, onClose, menuItems, position } = props;
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowClick = (e: any) => {
      // If the click wasn't inside the context menu, request to close the menu
      if (el.current && !el.current.contains(e.target)) {
        onClose && onClose();

        document.removeEventListener("click", handleWindowClick, true);
      }
    };

    open && document.addEventListener("click", handleWindowClick, true);
  }, [open, onClose]);

  return open
    ? ReactDOM.createPortal(
        <div className={classNames("c-context-menu", className)} style={{ top: position.y, left: position.x }} ref={el}>
          {menuItems.map(menuItem => (
            <div className="c-context-menu__item" onClick={menuItem.onClick}>
              <span>{menuItem.name}</span>
            </div>
          ))}
        </div>,
        document.body
      )
    : null;
};

export default ContextMenu;
