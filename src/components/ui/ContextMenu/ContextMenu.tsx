import { FC, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface IProps {
  open: boolean;
  onClose: () => void;
  menuItems: { name: string; onClick: () => void }[];
}

const ContextMenu: FC<IProps> = props => {
  const { open, onClose, menuItems } = props;
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
        <div style={{ background: "#000000" }} ref={el}>
          {menuItems.map(menuItem => (
            <div onClick={menuItem.onClick}>{menuItem.name}</div>
          ))}
        </div>,
        document.body
      )
    : null;
};

export default ContextMenu;
