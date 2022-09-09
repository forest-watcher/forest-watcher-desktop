import classNames from "classnames";
import { FC, PropsWithChildren } from "react";
import Chip from "../Chip/Chip";

export interface IProps {
  onClick?: () => void;
  className?: string;
  btnCaption: string;
}

const LinkPreview: FC<PropsWithChildren<IProps>> = props => {
  const { className, children, btnCaption, onClick } = props;

  return (
    <div className={classNames(className, "c-link-preview")}>
      <div className="c-link-preview__children">{children}</div>
      <Chip variant="secondary" className="c-link-preview__cta" onClick={onClick}>
        {btnCaption}
      </Chip>
    </div>
  );
};

export default LinkPreview;
