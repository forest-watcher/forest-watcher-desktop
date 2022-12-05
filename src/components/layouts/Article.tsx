import classnames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleValues?: { [key: string]: string | number };
  subtitle?: string;
  actions?: ReactNode;
  size?: "default" | "small";
}

const Article: FC<IProps> = ({
  title,
  subtitle,
  titleValues,
  children,
  actions,
  className,
  size = "default",
  ...rest
}) => {
  return (
    <article className={classnames("c-article row column", `c-article--size-${size}`, className)} {...rest}>
      {(title || actions) && (
        <div className="c-article__top-row">
          <div>
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
            {subtitle && (
              <p className="text-2xl font-[400] text-neutral-600 mt-3">
                <FormattedMessage id={subtitle} />
              </p>
            )}
          </div>
          {actions && <div className="c-article__actions">{actions}</div>}
        </div>
      )}
      {children}
    </article>
  );
};

export default Article;
