import React, { FC, HTMLAttributes } from "react";
import classnames from "classnames";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  altBackground?: boolean;
}

interface ITitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  HeadingLevel?: "h1" | "h2" | "h3" | "h5" | "h6";
}

/**
 * Useful link about Compound Components https://blog.martindidiego.com/compound-components-typescript
 */
interface ICardComposition {
  Title: FC<ITitleProps>;
  Text: FC<React.HTMLAttributes<HTMLParagraphElement>>;
}

const Section: FC<IProps> & ICardComposition = props => {
  const { className, children, altBackground = false, ...rest } = props;
  const classes = classnames(altBackground && "bg-neutral-400", className);

  return (
    <section className={classes} {...rest}>
      <div className="max-w-row mx-auto px-2.5 pt-15 pb-20">{children}</div>
    </section>
  );
};

const Title: ICardComposition["Title"] = props => {
  const { className, HeadingLevel = "h2", ...rest } = props;
  const classes = classnames("text-4xl font-[300] text-neutral-700", className);

  return <HeadingLevel {...rest} className={classes} />;
};

const Text: ICardComposition["Text"] = props => {
  const { className, ...rest } = props;
  const classes = classnames("text-2xl font-[400] text-neutral-600", className);

  return <p {...rest} className={classes} />;
};

Section.Title = Title;
Section.Text = Text;

export default Section;
