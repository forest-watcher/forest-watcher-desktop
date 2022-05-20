import React, { FC, HTMLAttributes, ImgHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  size?: "small" | "large";
  hoverState?: boolean;
  [key: string]: any;
}

interface ITitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  HeadingLevel?: "h1" | "h2" | "h3" | "h5" | "h6";
}

interface ICtaProps extends LinkProps {
  iconSrc?: string;
}

/**
 * Useful link about Compound Components https://blog.martindidiego.com/compound-components-typescript
 */
interface ICardComposition {
  Image: FC<ImgHTMLAttributes<HTMLImageElement>>;
  Title: FC<ITitleProps>;
  Cta: FC<ICtaProps>;
  Text: FC<React.HTMLAttributes<HTMLParagraphElement>>;
}

const Card: FC<IProps> & ICardComposition = props => {
  const { className, children, size = "large", hoverState = false, ...rest } = props;
  const classes = classnames("c-card", `c-card--${size}`, hoverState && "c-card--hover", className);

  return (
    <div className={classes} data-testid="card" {...rest}>
      {children}
    </div>
  );
};

const Image: FC<ImgHTMLAttributes<HTMLImageElement>> = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__image", className);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...rest} className={classes} />;
};

const Title: FC<ITitleProps> = props => {
  const { className, HeadingLevel = "h2", ...rest } = props;
  const classes = classnames("c-card__title", className);

  return <HeadingLevel {...rest} className={classes} />;
};

const Cta: FC<ICtaProps> = props => {
  const { className, iconSrc = "", children, ...rest } = props;
  const classes = classnames("c-card__cta", className);

  return (
    <Link {...rest} className={classes}>
      {iconSrc && <img role="presentation" alt="" className="c-card__cta-image" src={iconSrc} />}
      <span>{children}</span>
    </Link>
  );
};

const Text: FC<React.HTMLAttributes<HTMLParagraphElement>> = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__text", className);

  return <p {...rest} className={classes} />;
};

Card.Image = Image;
Card.Title = Title;
Card.Cta = Cta;
Card.Text = Text;

export default Card;
