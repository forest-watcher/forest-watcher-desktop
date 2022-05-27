import Button, { IProps as IButtonProps } from "components/ui/Button/Button";
import { FC, MouseEventHandler } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

interface IProps {
  title: string;
  titleValues?: { [key: string]: string | number };
  action?: {
    name: string;
    variant?: IButtonProps["variant"];
    callback: MouseEventHandler<HTMLButtonElement>;
  };
  backLink?: {
    className?: string;
    name: string;
    to: string;
    values?: { [key: string]: string | number };
  };
  children?: HTMLCollection;
}

const Hero: FC<IProps> = ({ title, titleValues, action, backLink, children }) => {
  return (
    <aside className="c-hero">
      <div className="row column">
        {backLink && (
          <div className="c-hero__content">
            <Link to={backLink.to} className={classnames("c-link", backLink.className)}>
              <FormattedMessage id={backLink.name} values={backLink.values} />
            </Link>
          </div>
        )}
        <div className="c-hero__content">
          <h1 className="u-text-700 u-text-neutral-300">
            <FormattedMessage id={title} values={titleValues} />
          </h1>
          <>{children}</>
          {action && (
            <Button variant={action.variant} onClick={action.callback}>
              <FormattedMessage id={action.name} />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Hero;
