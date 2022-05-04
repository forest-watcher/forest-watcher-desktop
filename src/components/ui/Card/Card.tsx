import React, { FC, HTMLAttributes, ImgHTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLBaseElement>  {
  size?: "small" | "large";
  as?: React.ElementType;
  [key: string]: any;
}

interface ITitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  HeadingLevel?: "h1" | "h2" | "h3" | "h5" | "h6";
}

interface ICtaProps extends React.HTMLAttributes<HTMLParagraphElement> {
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
  const { className, children, as = "div", size = "large", ...rest } = props;
  const Element = as;
  const classes = classnames("c-card", `c-card--${size}`, className);

  return (
    <Element className={classes} data-testid="card" {...rest}>
      {children}
    </Element>
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
    <p {...rest} className={classes}>
      {iconSrc && <img role="presentation" alt="" className="c-card__cta-image" src={iconSrc} />}
      <span>{children}</span>
    </p>
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
