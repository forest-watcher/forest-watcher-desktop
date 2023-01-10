import { FC, HTMLAttributes } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Icon from "components/extensive/Icon";

interface IProps extends HTMLAttributes<HTMLElement> {
  iconUrl?: string;
  title?: string;
  text?: string;
  ctaText?: string;
  ctaTo?: string;
  ctaIsExternal?: boolean;
  hasMargins?: boolean;
  textClassName?: string;
}

const EmptyState: FC<IProps> = props => {
  const {
    className,
    children,
    iconUrl,
    title,
    text,
    ctaText,
    ctaTo,
    ctaIsExternal = false,
    hasMargins = false,
    textClassName = "",
    ...rest
  } = props;
  const classes = classnames("c-empty-state", hasMargins && "c-empty-state--has-margins", className);

  return (
    <div className={classes} {...rest}>
      {iconUrl && <img src={iconUrl} role="presentation" alt="" className="c-empty-state__icon" />}
      {title && <h2 className="c-empty-state__title">{title}</h2>}
      {text && (
        <p className={classnames("c-empty-state__text", !ctaTo && "c-empty-state__text--no-margin", textClassName)}>
          {text}
        </p>
      )}
      {ctaTo &&
        ctaText &&
        (!ctaIsExternal ? (
          <Link to={ctaTo} className="c-button c-button--primary c-empty-state__cta">
            {ctaText}
          </Link>
        ) : (
          <a
            href={ctaTo}
            className="c-button c-button--primary c-empty-state__cta"
            rel="noreferrer nofollow"
            target="_blank"
          >
            <Icon size={18} name="ExternalLink" className="pr-1 my-[-1px]" />
            {ctaText}
          </a>
        ))}
    </div>
  );
};

export default EmptyState;
