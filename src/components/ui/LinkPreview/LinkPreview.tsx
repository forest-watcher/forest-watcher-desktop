import classNames from "classnames";
import { FC, PropsWithChildren, useState } from "react";
import { ReactComponent as CheckSVG } from "assets/images/icons/check-green.svg";
import Chip from "../Chip/Chip";
import { useIntl } from "react-intl";

export interface IProps extends PropsWithChildren {
  className?: string;
  btnCaption: string;
  link?: string;
  disabled?: boolean;
}

const LinkPreview: FC<IProps> = props => {
  const { className, children, btnCaption, link } = props;
  const intl = useIntl();
  const [copied, setCopied] = useState(false);

  return (
    <div className={classNames(className, "c-link-preview")}>
      {copied && (
        <div className="c-link-preview__label">
          <CheckSVG />
          {intl.formatMessage({ id: "export.copied" })}
        </div>
      )}

      <div className="c-link-preview__children u-flex-1">{children}</div>

      {link && (
        <Chip
          variant="secondary"
          className="c-link-preview__cta"
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
          }}
        >
          {btnCaption}
        </Chip>
      )}
    </div>
  );
};

export default LinkPreview;
