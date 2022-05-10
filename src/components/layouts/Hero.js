import Button from "components/ui/Button/Button";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

function Hero({ title, action, children }) {
  return (
    <aside className="c-hero">
      <div className="row column">
        <div className="hero-content">
          <h1 className="text -large-title -white">
            <FormattedMessage id={title} />
          </h1>
          {children}
          {action && (
            <Button onClick={action.callback}>
              <FormattedMessage id={action.name} />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  })
};

export default Hero;
