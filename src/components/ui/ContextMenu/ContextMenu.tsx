import { FC, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ContextMenu: FC<IProps> = props => {
  const { open, onClose } = props;
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowClick = (e: any) => {
      if (el.current && !el.current.contains(e.target)) {
        onClose && onClose();

        document.removeEventListener("click", handleWindowClick, true);
      } else {
        console.log("Click inside");
      }
    };

    open && document.addEventListener("click", handleWindowClick, true);
  }, [open, onClose]);

  return open
    ? ReactDOM.createPortal(
        <div style={{ background: "#000000" }} ref={el}>
          Hello Context World
        </div>,
        document.body
      )
    : null;
};

export default ContextMenu;
