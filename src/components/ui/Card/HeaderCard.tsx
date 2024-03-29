import classNames from "classnames";
import React, { HTMLAttributes, FC } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType<any>;
}

interface HeaderCardComposition {
  Header: FC<React.HTMLAttributes<HTMLDivElement>>;
  HeaderText: FC<IProps & React.HTMLAttributes<HTMLParagraphElement>>;
  Content: FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: FC<React.HTMLAttributes<HTMLDivElement>>;
}

const HeaderText: HeaderCardComposition["HeaderText"] = ({ className, children, as = "p" }) => {
  const Element = as;
  return <Element className={classNames(className, "text-[24px] text-neutral-700 font-[400]")}>{children}</Element>;
};

const Header: HeaderCardComposition["Header"] = ({ className, children }) => {
  return (
    <div
      className={classNames(
        className,
        "bg-primary-400 border-2 border-solid border-primary-500 py-7 px-6 rounded-t border-opacity-20"
      )}
    >
      {children}
    </div>
  );
};

const Footer: HeaderCardComposition["Footer"] = ({ className, children }) => {
  return (
    <div
      className={classNames(
        className,
        "bg-neutral-300 px-5 py-6 border-solid border-2 border-neutral-600 border-opacity-10 border-t-0 rounded-b"
      )}
    >
      {children}
    </div>
  );
};

const Content: HeaderCardComposition["Content"] = ({ className, children }) => {
  return (
    <div
      className={classNames(
        className,
        "bg-neutral-300 py-7 px-6 border-2 border-solid border-neutral-600 border-opacity-10 border-t-0 rounded-b"
      )}
    >
      {children}
    </div>
  );
};

const HeaderCard: FC<IProps> & HeaderCardComposition = ({ className, children, as = "div" }) => {
  const Element = as;
  return <Element className={classNames(className, "rounded-b")}>{children}</Element>;
};

HeaderCard.Header = Header;
HeaderCard.Content = Content;
HeaderCard.HeaderText = HeaderText;
HeaderCard.Footer = Footer;

export default HeaderCard;
