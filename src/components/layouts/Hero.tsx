import Button from "components/ui/Button/Button";
import { FC, MouseEventHandler } from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
  title: string;
  action?: {
    name: string;
    callback: MouseEventHandler<HTMLButtonElement>;
  };
  children?: HTMLCollection;
}

const Hero: FC<IProps> = ({ title, action, children }) => {
  return (
    <aside className="c-hero">
      <div className="row column">
        <div className="c-hero__content">
          <h1 className="u-text-700 u-text-neutral-300">
            <FormattedMessage id={title} />
          </h1>
          <>{children}</>
          {action && (
            <Button onClick={action.callback}>
              <FormattedMessage id={action.name} />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Hero;
