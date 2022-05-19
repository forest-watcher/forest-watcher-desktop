import classnames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleValues?: { [key: string]: string };
  actions?: ReactNode;
}

const Article: FC<IProps> = ({ title, titleValues, children, actions, className, ...rest }) => {
  return (
    <article className={classnames("c-article row column", className)} {...rest}>
      {(title || actions) && (
        <div className="c-article__top-row">
          {title && (
            <h2 className="c-article__title u-text-700 u-text-neutral-700">
              <FormattedMessage id={title} values={titleValues} />
            </h2>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </article>
  );
};

export default Article;
