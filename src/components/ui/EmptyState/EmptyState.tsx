import { FC, HTMLAttributes } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";

interface IProps extends HTMLAttributes<HTMLElement> {
  iconUrl?: string;
  title?: string;
  text?: string;
  ctaText?: string;
  ctaTo?: string;
}

const EmptyState: FC<IProps> = props => {
  const { className, children, iconUrl, title, text, ctaText, ctaTo, ...rest } = props;
  const classes = classnames("c-empty-state", className);

  return (
    <div className={classes} data-testid="button" {...rest}>
      {iconUrl && <img src={iconUrl} role="presentation" alt="" className="c-empty-state__icon" />}
      {title && <h2 className="c-empty-state__title">{title}</h2>}
      {text && <p className="c-empty-state__text">{text}</p>}
      {ctaTo && ctaText && (
        <Link to={ctaTo} className="c-button c-button--primary c-empty-state__cta">
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
