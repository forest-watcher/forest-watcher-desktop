import { FC, PropsWithChildren, ReactElement } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChevronRight from "assets/images/icons/ChevronRightBrandGreen.svg";

interface IProps {
  titleClassName?: string;
  title: string;
  titleValues?: { [key: string]: string | number };
  actions?: ReactElement;
  backLink?: {
    className?: string;
    name: string;
    to: string;
    values?: { [key: string]: string | number };
  };
}

const Hero: FC<PropsWithChildren<IProps>> = ({ titleClassName, title, titleValues, backLink, children, actions }) => {
  return (
    <aside className="c-hero">
      <div className="row column">
        {backLink && (
          <div className="c-hero__content">
            <Link to={backLink.to} className={classnames("c-link", "c-link--hero", backLink.className)}>
              <img src={ChevronRight} alt="" role="presentation" />
              <FormattedMessage id={backLink.name} values={backLink.values} />
            </Link>
          </div>
        )}
        <div className="c-hero__content">
          <h1 className={classnames(titleClassName, "u-text-700 u-text-neutral-300 u-text-capitalize u-text-ellipsis")}>
            <FormattedMessage id={title} values={titleValues} />
          </h1>
          <>{children}</>
          {actions && <div className="c-hero__actions">{actions}</div>}
        </div>
      </div>
    </aside>
  );
};

export default Hero;
