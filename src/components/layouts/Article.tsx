import classnames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleValues?: { [key: string]: string | number };
  actions?: ReactNode;
  titleSize?: string;
  size?: "default" | "small";
}

const Article: FC<IProps> = ({ title, titleValues, children, actions, className, size = "default", ...rest }) => {
  return (
    <article className={classnames("c-article row column", `c-article--size-${size}`, className)} {...rest}>
      {(title || actions) && (
        <div className="c-article__top-row">
          {title && (
            <h2
              className={classnames(
                "c-article__title u-text-neutral-700",
                `u-text-${size === "default" ? "700" : "600"}`
              )}
            >
              <FormattedMessage id={title} values={titleValues} />
            </h2>
          )}
          {actions && <div className="c-article__actions">{actions}</div>}
        </div>
      )}
      {children}
    </article>
  );
};

export default Article;
