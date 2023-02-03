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
    <aside className="bg-neutral-700">
      <div className="max-w-row mx-auto px-2.5 2xl:py-5 py-4">
        {backLink && (
          <div className="flex justify-between items-center gap-3">
            {backLink.to ? (
              <Link to={backLink.to} className={classnames("c-link", "c-link--hero", backLink.className)}>
                <img src={ChevronRight} alt="" role="presentation" />
                <FormattedMessage id={backLink.name} values={backLink.values} />
              </Link>
            ) : (
              <button
                onClick={() => history.push("/areas")}
                className={classnames("c-link", "c-link--hero", backLink.className)}
              >
                <img src={ChevronRight} alt="" role="presentation" />
                <FormattedMessage id={backLink.name} values={backLink.values} />
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between items-center gap-3 py-2 flex-wrap md:flex-nowrap">
          <h1 className={"text-4xl font-light text-neutral-300 capitalize text-ellipsis overflow-hidden basis-full"}>
            <FormattedMessage id={title} values={titleValues} />
          </h1>

          {pageTabs && <TabGroup value={pageTabs.value} options={pageTabs.options} />}

          <div className="flex-grow-0 flex-shrink basis-full">
            <>{children}</>
            {actions && <div className="flex gap-3 justify-end">{actions}</div>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Hero;
