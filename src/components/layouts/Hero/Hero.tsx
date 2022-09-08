import { FC, PropsWithChildren, ReactElement } from "react";
import classnames from "classnames";
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import TabGroup, { IProps as ITabGroupProps } from "components/ui/TabGroup/TabGroup";
import ChevronRight from "assets/images/icons/ChevronRightBrandGreen.svg";

interface IProps {
  title: string;
  titleValues?: { [key: string]: string | number };
  pageTabs?: ITabGroupProps;
  actions?: ReactElement;
  backLink?: {
    className?: string;
    name: string;
    to?: string;
    values?: { [key: string]: string | number };
  };
}

const Hero: FC<PropsWithChildren<IProps>> = props => {
  const { title, titleValues, backLink, pageTabs, children, actions } = props;
  const history = useHistory();

  return (
    <aside className={classnames("c-hero", pageTabs && "c-hero--with-tabs")}>
      <div className="row column">
        {backLink && (
          <div className="c-hero__content">
            {backLink.to ? (
              <Link to={backLink.to} className={classnames("c-link", "c-link--hero", backLink.className)}>
                <img src={ChevronRight} alt="" role="presentation" />
                <FormattedMessage id={backLink.name} values={backLink.values} />
              </Link>
            ) : (
              <button
                onClick={() => history.goBack()}
                className={classnames("c-link", "c-link--hero", backLink.className)}
              >
                <img src={ChevronRight} alt="" role="presentation" />
                <FormattedMessage id={backLink.name} values={backLink.values} />
              </button>
            )}
          </div>
        )}
        <div className="c-hero__content">
          <h1 className={"c-hero__title u-text-700 u-text-neutral-300 u-text-capitalize u-text-ellipsis"}>
            <FormattedMessage id={title} values={titleValues} />
          </h1>

          {pageTabs && (
            <TabGroup
              className={classnames(pageTabs.className, "c-hero__page-tabs")}
              value={pageTabs.value}
              options={pageTabs.options}
            />
          )}

          <div className="c-hero__spacer">
            <>{children}</>
            {actions && <div className="c-hero__actions">{actions}</div>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Hero;
