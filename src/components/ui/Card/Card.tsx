import React, { FC, HTMLAttributes, ImgHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  size?: "small" | "large";
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
interface ICardComposition extends React.ForwardRefExoticComponent<IProps & React.RefAttributes<HTMLDivElement>> {
  Image: FC<ImgHTMLAttributes<HTMLImageElement>>;
  Title: FC<ITitleProps>;
  Cta: FC<ICtaProps>;
  Text: FC<React.HTMLAttributes<HTMLParagraphElement>>;
  Header: FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: FC<React.HTMLAttributes<HTMLDivElement>>;
}

const Card = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { className, children, size = "large", ...rest } = props;
  const classes = classnames("c-card", `c-card--${size}`, className);

  return (
    <div className={classes} data-testid="card" ref={ref} {...rest}>
      {children}
    </div>
  );
}) as ICardComposition;

const Image: ICardComposition["Image"] = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__image", className);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...rest} className={classes} />;
};

const Title: ICardComposition["Title"] = props => {
  const { className, HeadingLevel = "h2", ...rest } = props;
  const classes = classnames("c-card__title", className);

  return <HeadingLevel {...rest} className={classes} />;
};

const Cta: ICardComposition["Cta"] = props => {
  const { className, iconSrc = "", children, ...rest } = props;
  const classes = classnames("c-card__cta", className);

  return (
    <Link {...rest} className={classes}>
      {iconSrc && <img role="presentation" alt="" className="c-card__cta-image" src={iconSrc} />}
      <span>{children}</span>
    </Link>
  );
};

const Text: ICardComposition["Text"] = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__text", className);

  return <p {...rest} className={classes} />;
};

const Header: ICardComposition["Header"] = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__header", className);

  return <div {...rest} className={classes} />;
};

const Footer: ICardComposition["Footer"] = props => {
  const { className, ...rest } = props;
  const classes = classnames("c-card__footer", className);

  return <div {...rest} className={classes} />;
};

Card.Image = Image;
Card.Title = Title;
Card.Cta = Cta;
Card.Text = Text;
Card.Header = Header;
Card.Footer = Footer;

export default Card;
